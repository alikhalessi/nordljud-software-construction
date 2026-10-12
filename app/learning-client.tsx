"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import type { Level, Mission } from "../lib/missions";
import { getSupabase } from "../lib/supabase";

type Score = { comprehension: boolean; verb: boolean };
type Progress = Record<string, Score>;
const GUEST_KEY = "nordljud-vibe-guest-v1";
const CLOUD_KEY = "nordljud_vibe_v1";
const LEVELS: Level[] = ["A2", "B1", "B2", "C1"];
const empty: Score = { comprehension: false, verb: false };

export default function LearningClient({ missions }: { missions: Mission[] }) {
  const [level, setLevel] = useState<Level>("A2");
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [progress, setProgress] = useState<Progress>({});
  const [translationShown, setTranslationShown] = useState(true);
  const [questionMessage, setQuestionMessage] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [explore, setExplore] = useState(false);
  const supabase = getSupabase();
  const mission = missions.find((m) => m.level === level) ?? missions[0];
  const score = progress[mission.id] ?? empty;
  const completedCount = missions.filter((m) => {
    const s = progress[m.id];
    return !!(s?.comprehension && s?.verb);
  }).length;

  useEffect(() => {
    if (!supabase) {
      try {
        const saved = localStorage.getItem(GUEST_KEY);
        if (saved) setProgress(JSON.parse(saved) as Progress);
      } catch {
        // Browser storage may be unavailable. The lessons still work in memory.
      }
      setAuthReady(true);
      return;
    }

    let active = true;
    async function initialize() {
      const { data, error } = await supabase!.auth.getUser();
      if (!active) return;
      if (error && error.status !== 400) setAuthMessage(error.message);
      setUser(data.user ?? null);
      if (data.user) await fetchProgress(data.user);
      setAuthReady(true);
    }

    async function fetchProgress(currentUser: User) {
      setLoadingProgress(true);
      const { data, error } = await supabase!.from("learner_states")
        .select("state").eq("user_id", currentUser.id).maybeSingle();
      if (active) {
        if (!error) {
          const state = data?.state as Record<string, unknown> | null | undefined;
          const saved = state?.[CLOUD_KEY] as Progress | undefined;
          setProgress(saved && typeof saved === "object" ? saved : {});
        } else {
          setSaveError("Could not load your saved progress: " + error.message);
        }
        setLoadingProgress(false);
      }
    }

    void initialize();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        // Deferring the database query avoids calling the Supabase API
        // synchronously inside the auth state callback.
        Promise.resolve().then(() => { if (active) void fetchProgress(session.user); });
      } else {
        setProgress({});
      }
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
    // The Supabase client is a singleton and does not change between renders.
  }, [supabase]);

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setAuthBusy(true);
    setAuthMessage("");
    const response = authMode === "signup"
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (response.error) {
      setAuthMessage(response.error.message);
    } else if (authMode === "signup" && !response.data.session) {
      setAuthMessage("Account requested. Check your email to confirm registration if required.");
    } else {
      setAuthMessage("Welcome to Nordljud.");
      setPassword("");
    }
    setAuthBusy(false);
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setAuthMessage(error.message);
    else {
      setProgress({});
      setAuthMessage("You signed out.");
    }
  }

  async function saveAnswer(which: keyof Score, correct: boolean) {
    if (!correct) return;
    const next: Progress = {
      ...progress,
      [mission.id]: { ...(progress[mission.id] ?? empty), [which]: true }
    };
    setProgress(next);
    setSaveError("");
    if (!supabase || !user) {
      try {
        localStorage.setItem(GUEST_KEY, JSON.stringify(next));
      } catch {
        setSaveError("Your browser does not allow local storage; progress may be lost on refresh.");
      }
      return;
    }
    setSaving(true);
    // Keep the earlier project's other state fields instead of overwriting them.
    const { data, error: readError } = await supabase.from("learner_states")
      .select("state").eq("user_id", user.id).maybeSingle();
    if (readError) {
      setSaveError("Cannot read your cloud progress: " + readError.message);
      setSaving(false);
      return;
    }
    const previous = data?.state && typeof data.state === "object"
      ? data.state as Record<string, unknown> : {};
    const { error } = await supabase.from("learner_states").upsert({
      user_id: user.id,
      state: { ...previous, [CLOUD_KEY]: next },
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });
    if (error) setSaveError("Could not save your progress: " + error.message);
    setSaving(false);
  }

  function answer(which: keyof Score, choice: number) {
    const expected = which === "comprehension"
      ? mission.comprehension.correctIndex : mission.verbQuestion.correctIndex;
    const correct = choice === expected;
    setQuestionMessage(correct
      ? "Correct! Nicely done — this part is saved."
      : "Not quite. Try again and compare with the example above.");
    void saveAnswer(which, correct);
  }

  function playSwedish(sentence: string) {
    setVoiceMessage("");
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setVoiceMessage("Audio is unavailable in this browser.");
      return;
    }
    const synth = window.speechSynthesis;
    const swedishVoice = () =>
      synth.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("sv"));

    function startPlayback() {
      const selected = swedishVoice();
      if (!selected) {
        setVoiceMessage(
          "No Swedish text-to-speech voice is available. Install a Swedish speech voice in your operating system, restart Chrome, and try again."
        );
        return;
      }
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = "sv-SE";
      utterance.voice = selected;
      utterance.rate = 0.87;
      utterance.onstart = () => setVoiceMessage("");
      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        // Rapidly selecting another example cancels or interrupts the old one.
        // Do not present that normal user interaction as an audio failure.
        if (event.error === "canceled" || event.error === "interrupted") return;
        const message = event.error === "language-unavailable" || event.error === "voice-unavailable"
          ? "Swedish voice could not be started. Check Swedish text-to-speech voice installation."
          : "Playback failed (" + event.error + "). Check browser speech settings.";
        setVoiceMessage(message);
      };
      try {
        synth.speak(utterance);
      } catch (error) {
        const reason = error instanceof Error ? error.message : "unknown error";
        setVoiceMessage("Browser audio could not start: " + reason);
      }
    }

    if (synth.getVoices().length > 0) {
      startPlayback();
    } else {
      // Chrome often populates Web Speech voices asynchronously after page load.
      setVoiceMessage("Checking Swedish voice availability…");
      let started = false;
      const whenVoicesLoad = () => {
        if (started) return;
        started = true;
        synth.removeEventListener("voiceschanged", whenVoicesLoad);
        window.clearTimeout(waitTimer);
        startPlayback();
      };
      synth.addEventListener("voiceschanged", whenVoicesLoad);
      const waitTimer = window.setTimeout(whenVoicesLoad, 1500);
    }
  }

  function chooseLevel(next: Level) {
    setLevel(next);
    setQuestionMessage("");
    setVoiceMessage("");
    setTranslationShown(true);
    setExplore(false);
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="brand" aria-label="Nordljud home">
          <span className="brand-mark">N</span>
          <div><strong>nordljud<span className="brand-dot">.</span></strong>
            <small>SWEDISH YOU CAN USE</small></div>
        </div>
        <div className="top-actions">
          <span className="pilot-label">LEARNING PILOT · A2—C1</span>
          {user && <button className="small-button" onClick={() => void signOut()}>Sign out</button>}
        </div>
      </header>

      <main>
        <section className="hero">
          <div>
            <div className="eyebrow">NORDLJUD · LEARN WITH PURPOSE</div>
            <h1>Speak a little more <em>Swedish</em> every day.</h1>
            <p>Real situations, useful verbs, and clear English help. Choose a level and practise one practical mission at a time.</p>
            <div className="hero-tags"><span>4 learning levels</span><span>Short missions</span><span>Listen & practise</span></div>
          </div>
          <div className="hero-aside">
            <div className="eyebrow">YOUR JOURNEY</div>
            <div className="hero-number">{completedCount}<span> / {missions.length}</span></div>
            <div>missions completed</div>
            <div className="meter"><span style={{width:(completedCount/missions.length*100)+"%"}} /></div>
            <small>{loadingProgress ? "Loading progress…" : !supabase ? "Guest preview · saved on this browser only" : user ? "Signed in · cloud progress enabled" : "Sign in below to save cloud progress"}</small>
          </div>
        </section>

        <div className="workspace">
          <aside className="sidebar">
            <div className="side-title">LEARNING PATH</div>
            <p className="side-description">Select your Swedish level.</p>
            <div className="levels">
              {LEVELS.map((entry) => {
                const item = missions.find((m) => m.level === entry);
                const done = item && progress[item.id]?.comprehension && progress[item.id]?.verb;
                return <button key={entry} className={["level-button",level===entry?"active":""].join(" ")}
                  onClick={() => chooseLevel(entry)} aria-pressed={level===entry}>
                  <span className="level-circle">{entry}</span>
                  <span className="level-copy"><strong>{entry === "A2" ? "Build confidence" : entry === "B1" ? "Everyday fluency" : entry === "B2" ? "Express your ideas" : "C1 · Go deeper"}</strong><small>{item?.title}</small></span>
                  <span className="done-indicator">{done ? "✓" : "›"}</span>
                </button>;
              })}
            </div>

            <div className="sidebar-note">
              <strong>About these lessons</strong>
              <p>Our examples come from a shared Swedish–English learning collection. The teaching content is still under review.</p>
            </div>
          </aside>

          <section className="lesson-area">
            <div className="section-heading"><span className="eyebrow">{level} · MISSION 01</span><span className="mission-meta">One practical mission</span></div>
            <h2>{mission.title}</h2>
            <p className="lesson-intro">{mission.goal}</p>
            <div className="lesson-badges"><span>Key verb: <strong>{mission.verb}</strong></span><span>Meaning: {mission.meaning}</span><span>{mission.context}</span></div>

            <div className="lesson-card">
              <div className="card-heading">
                <div><div className="eyebrow">01 · LISTEN & LEARN</div><h3>Swedish in context</h3></div>
                <button className="small-button" onClick={() => setTranslationShown(!translationShown)}>{translationShown ? "Hide English" : "Show English"}</button>
              </div>
              <p className="micro-copy">Tap the speaker to hear Swedish pronunciation.</p>
              {mission.examples.map((example) => (
                <div className="example-row" key={example.key}>
                  <div className="form-tag"><strong>{example.word}</strong><small>{example.label}</small></div>
                  <div className="example-text"><p lang="sv">{example.sv}</p>{translationShown && <small>{example.en}</small>}</div>
                  <button className="audio-button" aria-label={"Play Swedish: "+example.sv} title="Play Swedish" onClick={() => playSwedish(example.sv)}>▶</button>
                </div>
              ))}
              {voiceMessage && <p className="feedback warning" role="status">{voiceMessage}</p>}
            </div>

            <div className="lesson-card">
              <div className="card-heading">
                <div><div className="eyebrow">02 · CHECK UNDERSTANDING</div><h3>What does it mean?</h3></div>
                {score.comprehension && <span className="success-pill">✓ Completed</span>}
              </div>
              <p className="question">{mission.comprehension.question}</p>
              <div className="choices">{mission.comprehension.choices.map((choice, index) => (
                <button key={index} disabled={score.comprehension} className="choice" onClick={() => answer("comprehension", index)}>
                  <span>{String.fromCharCode(65+index)}</span>{choice}
                </button>
              ))}</div>
            </div>

            <div className="lesson-card">
              <div className="card-heading">
                <div><div className="eyebrow">03 · PRACTISE THE VERB</div><h3>Choose the correct form</h3></div>
                {score.verb && <span className="success-pill">✓ Completed</span>}
              </div>
              <p className="question">{mission.verbQuestion.question}</p>
              <div className="choices">{mission.verbQuestion.choices.map((choice, index) => (
                <button key={index} disabled={score.verb} className="choice" onClick={() => answer("verb", index)}>
                  <span>{String.fromCharCode(65+index)}</span>{choice}
                </button>
              ))}</div>
              {questionMessage && <p className="feedback" role="status">{questionMessage}</p>}
              {score.comprehension && score.verb && <div className="success-banner">Well done! Mission complete. Choose another level to continue.</div>}
              {saving && <p className="micro-copy" role="status">Saving your progress…</p>}
              {saveError && <p className="feedback warning" role="alert">{saveError}</p>}
            </div>
          </section>
        </div>

        {!user && <section className="account-panel">
          <div><div className="eyebrow">YOUR LEARNING ACCOUNT</div><h2>Keep your progress with you.</h2>
            <p>{supabase ? "Create an account or sign in to sync your mission results." : "Guest preview is available. To enable accounts, configure the Supabase environment variables in your own deployment."}</p>
            <button className="text-button" onClick={() => setExplore(!explore)} aria-expanded={explore}>What is saved? {explore ? "−" : "+"}</button>
            {explore && <p className="micro-copy">Only your mission completion results are stored. Guest mode uses this browser; signed-in mode uses the Supabase table protected by row-level security.</p>}
          </div>
          <div className="auth-box">
            <div className="auth-tabs">
              <button className={authMode==="signin"?"selected":""} onClick={()=>setAuthMode("signin")}>Sign in</button>
              <button className={authMode==="signup"?"selected":""} onClick={()=>setAuthMode("signup")}>Create account</button>
            </div>
            <form onSubmit={handleAuth}>
              <label>Email<input type="email" autoComplete="email" required disabled={!supabase||authBusy}
                value={email} onChange={(event)=>setEmail(event.target.value)} placeholder="name@example.com" /></label>
              <label>Password<input type="password" autoComplete={authMode==="signup"?"new-password":"current-password"}
                required minLength={6} disabled={!supabase||authBusy} value={password}
                onChange={(event)=>setPassword(event.target.value)} placeholder="At least 6 characters"/></label>
              <button className="primary-button" disabled={!supabase||!authReady||authBusy} type="submit">
                {authBusy ? "Please wait…" : authMode==="signin"?"Sign in":"Create account"}</button>
              {authMessage && <p className="feedback" role="status">{authMessage}</p>}
            </form>
          </div>
        </section>}
      </main>
      <footer>Nordljud learning pilot · English → Swedish · Teaching examples require language review</footer>
    </div>
  );
}
