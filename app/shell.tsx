"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { browserSupabase } from "../lib/supabase-browser";
import {
  EMPTY_RECORD, FORMS, LEVELS, TENSE_NAMES,
  type LearnerRecord, type Lesson, type Level, type SwedishVerb
} from "../domain/types";

type Screen = "missions" | "dictionary" | "profile";
type AuthMode = "login" | "register";
const STORAGE_KEY = "nordljud_godmode_guest_v1";
const CLOUD_NAMESPACE = "nordljud_godmode_v1";

function validRecord(value: unknown): LearnerRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ...EMPTY_RECORD };
  const parsed = value as Partial<LearnerRecord>;
  return {
    missions: parsed.missions && typeof parsed.missions === "object" ? parsed.missions : {},
    favorites: Array.isArray(parsed.favorites)
      ? parsed.favorites.filter((name): name is string => typeof name === "string") : []
  };
}

// A lexicon entry is a sense, not just a spelling. "sticka" has two meanings.
function senseId(item: SwedishVerb): string { return item.v + "::" + item.meaning; }

function useSpeech() {
  const [message, setMessage] = useState("");
  const speak = (text: string) => {
    setMessage("");
    if (!("speechSynthesis" in window)) {
      setMessage("Speech playback is unavailable on this device.");
      return;
    }
    const tts = window.speechSynthesis;
    const play = () => {
      const voices = tts.getVoices();
      const swedish = voices.find((v) => v.lang.toLowerCase().startsWith("sv"));
      if (!swedish) {
        setMessage("No Swedish speech voice found. Install Swedish text-to-speech on this device.");
        return;
      }
      tts.cancel();
      const request = new SpeechSynthesisUtterance(text);
      request.lang = "sv-SE";
      request.voice = swedish;
      request.rate = 0.9;
      request.onerror = (event) => {
        if (!["canceled", "interrupted"].includes(event.error)) {
          setMessage("Audio could not start: " + event.error);
        }
      };
      tts.speak(request);
    };
    if (tts.getVoices().length) {
      play();
    } else {
      setMessage("Loading available Swedish voices…");
      let handled = false;
      const onVoices = () => {
        if (handled) return;
        handled = true;
        tts.removeEventListener("voiceschanged", onVoices);
        window.clearTimeout(fallback);
        setMessage("");
        play();
      };
      tts.addEventListener("voiceschanged", onVoices);
      const fallback = window.setTimeout(onVoices, 1200);
    }
  };
  return { message, speak };
}

export default function AppShell({ lessons }: { lessons: Lesson[] }) {
  const [screen, setScreen] = useState<Screen>("missions");
  const [level, setLevel] = useState<Level>("A2");
  const [lexiconLevel, setLexiconLevel] = useState<Level>("A2");
  const [lemma, setLemma] = useState("arbeta");
  const [search, setSearch] = useState("");
  const [onlySaved, setOnlySaved] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [vocabulary, setVocabulary] = useState<SwedishVerb[]>([]);
  const [vocabStatus, setVocabStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [vocabLoaded, setVocabLoaded] = useState<Level | null>(null);
  const vocabularyCache = useRef<Partial<Record<Level, SwedishVerb[]>>>({});
  const [account, setAccount] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [record, setRecord] = useState<LearnerRecord>({ ...EMPTY_RECORD });
  const [saveMessage, setSaveMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const speech = useSpeech();
  const supabase = browserSupabase();

  const mission = lessons.find((item) => item.level === level) ?? lessons[0];
  const result = record.missions[mission.id] ?? { meaning: false, form: false };
  const completed = lessons.filter((item) => {
    const done = record.missions[item.id];
    return done?.meaning && done?.form;
  }).length;

  useEffect(() => {
    try {
      const last = sessionStorage.getItem("nordljud_godmode_nav");
      if (last) {
        const data = JSON.parse(last) as Partial<{
          screen: Screen; level: Level; lexiconLevel: Level; lemma: string
        }>;
        if (data.screen && ["missions", "dictionary", "profile"].includes(data.screen)) setScreen(data.screen);
        if (data.level && LEVELS.includes(data.level)) setLevel(data.level);
        if (data.lexiconLevel && LEVELS.includes(data.lexiconLevel)) setLexiconLevel(data.lexiconLevel);
        if (typeof data.lemma === "string") setLemma(data.lemma);
      }
      const params = new URLSearchParams(window.location.search);
      const queryError = params.get("error_description") || params.get("error");
      const hashError = new URLSearchParams(window.location.hash.slice(1));
      const message = queryError || hashError.get("error_description") || hashError.get("error");
      if (message) {
        setAuthError("Sign-in could not be completed: " + message);
        setScreen("profile");
      }
    } catch {
      // Local navigation is a convenience, not a prerequisite to learn.
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem("nordljud_godmode_nav", JSON.stringify({ screen, level, lexiconLevel, lemma }));
    } catch {
      // Private browser windows can reject session storage.
    }
  }, [screen, level, lexiconLevel, lemma]);

  useEffect(() => {
    let live = true;
    const guest = () => {
      try {
        return validRecord(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
      } catch { return { ...EMPTY_RECORD }; }
    };

    if (!supabase) {
      setRecord(guest());
      setReady(true);
      return;
    }

    async function loadUser(who: User) {
      const { data, error } = await supabase!.from("learner_states")
        .select("state").eq("user_id", who.id).maybeSingle();
      if (!live) return;
      if (error) {
        setSaveMessage("Could not load cloud progress: " + error.message);
      } else {
        const state = data?.state as Record<string, unknown> | undefined;
        setRecord(validRecord(state?.[CLOUD_NAMESPACE]));
      }
    }

    void supabase.auth.getUser().then(async ({ data, error }) => {
      if (!live) return;
      if (error && error.name !== "AuthSessionMissingError") setAuthError(error.message);
      const current = data.user ?? null;
      setAccount(current);
      if (current) await loadUser(current);
      else setRecord(guest());
      if (live) setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!live) return;
      setAccount(session?.user ?? null);
      if (session?.user) {
        Promise.resolve().then(() => { if (live) void loadUser(session.user); });
      } else {
        setRecord(guest());
      }
    });
    return () => {
      live = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (screen !== "dictionary") return;
    let live = true;
    const cached = vocabularyCache.current[lexiconLevel];
    if (cached) {
      setVocabulary(cached);
      setVocabLoaded(lexiconLevel);
      setVocabStatus("ready");
      return;
    }
    setVocabStatus("loading");
    const controller = new AbortController();
    void fetch("/api/lexicon/" + lexiconLevel, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw Error("Server response: " + response.status);
        const value = await response.json() as { items?: SwedishVerb[] };
        if (!Array.isArray(value.items) || value.items.length !== 456) {
          throw Error("Unexpected vocabulary data.");
        }
        if (!live) return;
        vocabularyCache.current[lexiconLevel] = value.items;
        setVocabulary(value.items);
        setVocabLoaded(lexiconLevel);
        setVocabStatus("ready");
      })
      .catch(() => { if (live) setVocabStatus("error"); });
    return () => { live = false; controller.abort(); };
  }, [lexiconLevel, screen]);

  // A lemma is stable across all four CEFR datasets. Level changes never modify it.
  const availableVerbs = vocabLoaded === lexiconLevel ? vocabulary : [];
  const normalized = search.trim().toLocaleLowerCase("sv-SE");
  const matches = useMemo(() => availableVerbs.filter((item) => {
    if (onlySaved && !record.favorites.includes(senseId(item))) return false;
    if (!normalized) return true;
    const text = [item.v, item.meaning, ...FORMS.flatMap((tense) => [
      item.forms[tense].word, item.forms[tense].sv, item.forms[tense].en
    ])].join(" ").toLocaleLowerCase("sv-SE");
    return text.includes(normalized);
  }), [availableVerbs, normalized, onlySaved, record.favorites]);

  const chosen = matches.find((item) => senseId(item) === lemma || item.v === lemma) ?? matches[0] ?? null;

  async function commitRecord(next: LearnerRecord) {
    setRecord(next);
    setSaveMessage("");
    if (!supabase || !account) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
      catch { setSaveMessage("Browser storage is unavailable. Results may not persist."); }
      return;
    }
    const { data, error: readError } = await supabase.from("learner_states")
      .select("state").eq("user_id", account.id).maybeSingle();
    if (readError) {
      setSaveMessage("Cannot save progress: " + readError.message);
      return;
    }
    const previous = data?.state && typeof data.state === "object"
      ? data.state as Record<string, unknown> : {};
    const { error } = await supabase.from("learner_states").upsert({
      user_id: account.id,
      state: { ...previous, [CLOUD_NAMESPACE]: next },
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });
    if (error) setSaveMessage("Cloud save failed: " + error.message);
  }

  function favorite(target: string) {
    void commitRecord({
      ...record,
      favorites: record.favorites.includes(target)
        ? record.favorites.filter((v) => v !== target)
        : [...record.favorites, target]
    });
  }

  function submitQuestion(kind: "meaning" | "form", selection: number, solution: number) {
    if (selection !== solution) {
      setSaveMessage("Not quite — review the sentence and try another answer.");
      return;
    }
    const before = record.missions[mission.id] ?? { meaning: false, form: false };
    void commitRecord({
      ...record,
      missions: { ...record.missions, [mission.id]: { ...before, [kind]: true } }
    });
  }

  async function authWithEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || busy) return;
    setAuthError("");
    setBusy(true);
    try {
      const response = authMode === "register"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });
      if (response.error) setAuthError(response.error.message);
      else if (authMode === "register" && !response.data.session) {
        setAuthError("Check your email for a confirmation link before signing in.");
      } else setPassword("");
    } finally { setBusy(false); }
  }

  async function authWithGoogle() {
    if (!supabase || busy) return;
    setAuthError("");
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/" }
      });
      if (error) {
        setAuthError("Google authentication: " + error.message);
        setBusy(false);
      }
    } catch (reason) {
      setAuthError(reason instanceof Error ? reason.message : "Google login unavailable.");
      setBusy(false);
    }
  }

  async function logout() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setAuthError(error.message);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="logo"><span className="logo-glyph">N</span><div><b>Nordljud</b><small>Practice Swedish with purpose</small></div></div>
        <nav className="main-menu" aria-label="Primary">
          <button className={screen==="missions"?"current":""} onClick={()=>setScreen("missions")}>Missions</button>
          <button className={screen==="dictionary"?"current":""} onClick={()=>setScreen("dictionary")}>Verb library</button>
          <button className={screen==="profile"?"current":""} onClick={()=>setScreen("profile")}>My learning</button>
        </nav>
        {account ? <button className="account-chip" onClick={()=>setScreen("profile")}>{account.email || "Account"}</button>
          : <button className="account-chip" onClick={()=>setScreen("profile")}>Sign in</button>}
      </header>

      <section className="banner">
        <div><span className="subhead">YOUR PRACTICAL SWEDISH STUDIO</span><h1>Learn what you will <em>actually say.</em></h1>
          <p>Four focused missions, 456 Swedish verbs and listening practice at the right difficulty for you.</p></div>
        <div className="stat"><strong>{completed} / {lessons.length}</strong><span>Missions completed</span><div className="progress-bar"><span style={{width:(100*completed/lessons.length)+"%"}} /></div>
          <small>{account?"Personal cloud progress": "Guest progress on this device"}</small></div>
      </section>

      {screen === "missions" && <main className="mission-layout">
        <aside className="mission-navigation">
          <h2>Choose your level</h2><p>One useful situation at each stage.</p>
          {LEVELS.map((item) => {
            const lesson = lessons.find((one) => one.level === item);
            const status = record.missions[lesson?.id || ""];
            return <button className={"level-item "+(item===level?"selected":"")} key={item}
              aria-pressed={item===level} onClick={() => { setLevel(item); setSaveMessage(""); }}>
              <strong>{item}</strong><span>{lesson?.title}</span>{status?.meaning&&status?.form&&<b>✓</b>}
            </button>;
          })}
          <div className="side-tip"><b>Daily habit</b><p>Read aloud before playing the audio. Small routines build confidence.</p></div>
        </aside>
        <div className="mission-content">
          <span className="subhead">MISSION · {mission.level}</span>
          <h2>{mission.title}</h2><p className="description">{mission.goal}</p>
          <div className="mission-verb">Featured verb <b>{mission.verb}</b><small>{mission.meaning}</small></div>
          <article className="panel">
            <div className="panel-top"><div><span className="subhead">STEP 1 · EXPLORE</span><h3>Listen and understand</h3></div>
              <button className="outline" onClick={()=>setShowTranslation(!showTranslation)}>
                {showTranslation?"Hide English":"Show English"}</button></div>
            {mission.examples.map(({tense, form})=><div className="sentence" key={tense}>
              <div className="tense">{TENSE_NAMES[tense]}<strong>{form.word}</strong></div>
              <div><p lang="sv">{form.sv}</p>{showTranslation&&<small>{form.en}</small>}</div>
              <button aria-label={"Speak "+form.sv} className="listen" onClick={()=>speech.speak(form.sv)}>▶</button>
            </div>)}
            {speech.message&&<p className="notification">{speech.message}</p>}
          </article>
          <article className="panel"><span className="subhead">STEP 2 · PRACTISE</span><h3>Quick check</h3>
            {mission.questions.map((q,index)=>{
              const completedQuestion = index===0?result.meaning:result.form;
              return <div className="challenge" key={index}>
                <div className="challenge-head"><b>Question {index+1}</b>{completedQuestion&&<span className="passed">✓ Correct</span>}</div>
                <p>{q.prompt}</p><div className="answers">
                  {q.options.map((choice,choiceIndex)=><button key={choiceIndex} disabled={completedQuestion}
                    onClick={()=>submitQuestion(index===0?"meaning":"form",choiceIndex,q.solution)}>
                    <span>{String.fromCharCode(65+choiceIndex)}</span>{choice}</button>)}
                </div>
              </div>;
            })}
            {result.meaning&&result.form&&<p className="passed">Mission complete. Excellent work!</p>}
          </article>
        </div>
      </main>}

      {screen==="dictionary"&&<main className="dictionary-layout">
        <div className="section-intro"><span className="subhead">THE FULL VERB COLLECTION</span>
          <h2>Explore 456 Swedish verbs</h2><p>Keep your chosen word as you move between levels. Example sentences adapt to you.</p></div>
        <div className="search-controls">
          <label className="search-input">Find a word or English meaning
            <input type="search" placeholder="Search Swedish or English..." value={search}
              onChange={(e)=>setSearch(e.target.value)}/></label>
          <label className="level-select">Sentence level
            <select value={lexiconLevel} onChange={(e)=>setLexiconLevel(e.target.value as Level)}>
              {LEVELS.map((item)=><option key={item}>{item}</option>)}
            </select></label>
          <label className="saved-only"><input type="checkbox" checked={onlySaved}
            onChange={(e)=>setOnlySaved(e.target.checked)}/> Favorites only</label>
        </div>
        <div className="dictionary-columns">
          <div className="word-list"><div className="list-header">
            <b>{vocabStatus==="loading" || vocabLoaded!==lexiconLevel ? "Loading..." : matches.length+" verbs"}</b>
            <small>Select a word to view its forms</small></div>
            {vocabStatus==="error"&&<p className="notification">Could not load the Swedish words. Try another level and return.</p>}
            {vocabLoaded===lexiconLevel&&matches.map((item)=><div className={"word-item "+(item===chosen?"selected":"")} key={senseId(item)}>
              <button onClick={()=>setLemma(senseId(item))}><b>{item.v}</b><small>{item.meaning}</small></button>
              <button className="star" aria-pressed={record.favorites.includes(senseId(item))}
                aria-label={"Toggle favorite "+item.v} onClick={()=>favorite(senseId(item))}>
                {record.favorites.includes(senseId(item))?"★":"☆"}</button>
            </div>)}
            {vocabLoaded===lexiconLevel && matches.length===0 &&<p className="notification">No matching words.</p>}
          </div>
          <article className="panel word-details">
            {vocabLoaded!==lexiconLevel?<p>Loading {lexiconLevel} examples…</p>:chosen?<><div className="word-heading">
              <div><span className="subhead">{lexiconLevel} VERB FORMS</span><h3>{chosen.v}</h3><p>{chosen.meaning}</p></div>
              <button className="star big" aria-label="Toggle favorite" onClick={()=>favorite(senseId(chosen))}>
                {record.favorites.includes(senseId(chosen))?"★":"☆"}</button>
            </div>
            <button className="outline" onClick={()=>setShowTranslation(!showTranslation)}>
              {showTranslation?"Hide English":"Show English"}</button>
            {FORMS.map((tense)=>{
              const form=chosen.forms[tense];
              const available=!!form?.sv?.trim()&&!!form?.en?.trim()&&form.word!=="—";
              return <div className="sentence" key={tense}><div className="tense">{TENSE_NAMES[tense]}
                <strong>{form?.word||"—"}</strong></div><div>
                {available?<><p lang="sv">{form.sv}</p>{showTranslation&&<small>{form.en}</small>}</>
                  :<small>No verified example for this form.</small>}
                </div><button className="listen" disabled={!available}
                  aria-label={"Listen: "+chosen.v+", "+TENSE_NAMES[tense]}
                  onClick={()=>speech.speak(form.sv)}>▶</button></div>;
            })}
            {speech.message&&<p className="notification">{speech.message}</p>}
            </>:<p>Select a verb to see its examples.</p>}
          </article>
        </div>
      </main>}

      {screen==="profile"&&<main className="profile-page">
        <span className="subhead">MY LEARNING SPACE</span><h2>Every step counts.</h2>
        <div className="profile-columns">
          <section className="panel">
            <h3>Learning progress</h3><p className="description">{completed} of 4 missions completed.</p>
            {lessons.map((lesson)=>{
              const mark=record.missions[lesson.id];
              const score=Number(!!mark?.meaning)+Number(!!mark?.form);
              return <button className="progress-item" key={lesson.id}
                onClick={()=>{setLevel(lesson.level);setScreen("missions");}}>
                <b>{lesson.level} · {lesson.title}</b><small>{score}/2 correct</small>
                <span className="progress-bar"><span style={{width:(score*50)+"%"}} /></span>
              </button>;
            })}
            <h3>Favorite verbs</h3><p className="description">
              {record.favorites.length?record.favorites.map((id) => id.replace("::", " — ")).join(" · "):"Select stars in the library to save words here."}</p>
            <button className="outline" onClick={()=>setScreen("dictionary")}>Open verb library</button>
          </section>
          <section className="panel account-panel">
            {account?<><span className="subhead">SIGNED IN</span><h3>Welcome back</h3>
              <p>{account.email || "Google account"}</p><p>Your course progress and favorites are linked to this account.</p>
              <button className="primary" onClick={()=>void logout()}>Sign out</button></>
              :<><span className="subhead">PERSONAL ACCOUNT</span><h3>Save your Swedish journey</h3>
                <p>Continue with Google, or use your email address and password.</p>
                <button className="google-login" disabled={!supabase || !ready || busy}
                  onClick={()=>void authWithGoogle()}>Continue with Google</button>
                <div className="auth-switch">
                  <button className={authMode==="login"?"selected":""} onClick={()=>setAuthMode("login")}>Sign in</button>
                  <button className={authMode==="register"?"selected":""} onClick={()=>setAuthMode("register")}>Create account</button>
                </div>
                <form onSubmit={authWithEmail}>
                  <label>Email<input autoComplete="email" type="email" required value={email}
                    onChange={(e)=>setEmail(e.target.value)} disabled={!supabase||busy}/></label>
                  <label>Password<input type="password" required minLength={6}
                    autoComplete={authMode==="register"?"new-password":"current-password"}
                    value={password} onChange={(e)=>setPassword(e.target.value)}
                    disabled={!supabase||busy}/></label>
                  <button className="primary" type="submit" disabled={!supabase||!ready||busy}>
                    {busy?"Please wait…":authMode==="login"?"Sign in":"Create account"}</button>
                </form>
                {!supabase&&<p className="notification">Account features require Supabase preview environment variables.</p>}
              </>}
            {authError&&<p role="alert" className="notification">{authError}</p>}
          </section>
        </div>
      </main>}

      {saveMessage&&<p role="status" className="notification global-notification">{saveMessage}</p>}
      <footer>Nordljud classroom pilot · examples require independent Swedish-teacher review · Browser audio</footer>
    </div>
  );
}
