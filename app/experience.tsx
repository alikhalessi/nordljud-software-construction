"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { learnerAuth } from "../src/supabase";
import {
  blankProgress, isLevel, levels, parseProgress, senseKey,
  tenseCodes, tenseLabels,
  type Level, type Lesson, type ProgressRecord, type VerbSense
} from "../src/domain";

type Section = "study" | "explore" | "me";
type LoginMode = "login" | "register";
const cloudKey = "nordljud_sdd_v1";
const guestKey = "nordljud_sdd_guest_v1";
const navKey = "nordljud_sdd_navigation";

function guestRecord(): ProgressRecord {
  try { return parseProgress(JSON.parse(localStorage.getItem(guestKey) || "null")); }
  catch { return blankProgress(); }
}

function displaySense(key: string): string {
  try {
    const parts: unknown = JSON.parse(key);
    if (Array.isArray(parts) && parts.length === 2) return parts.join(" — ");
  } catch { /* tolerate a saved key produced by a previous version */ }
  return key;
}

export default function LearningExperience({ lessons }: { lessons: readonly Lesson[] }) {
  const client = learnerAuth();
  const [screen, setScreen] = useState<Section>("study");
  const [lessonLevel, setLessonLevel] = useState<Level>("A2");
  const [dictionaryLevel, setDictionaryLevel] = useState<Level>("A2");
  const [search, setSearch] = useState("");
  const [selectedSense, setSelectedSense] = useState("");
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [revealEnglish, setRevealEnglish] = useState(true);
  const [lexicon, setLexicon] = useState<VerbSense[] | null>(null);
  const [lexiconFor, setLexiconFor] = useState<Level | null>(null);
  const [lexiconError, setLexiconError] = useState("");
  const [identity, setIdentity] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState<LoginMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authFeedback, setAuthFeedback] = useState("");
  const [learning, setLearning] = useState<ProgressRecord>(blankProgress);
  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState<Record<string, string>>({});
  const [audioFeedback, setAudioFeedback] = useState("");

  const currentMission = lessons.find((lesson) => lesson.level === lessonLevel) ?? lessons[0];
  const completedMissions = lessons.filter((lesson) => {
    const marks = learning.completed[lesson.id];
    return marks?.comprehension && marks?.forms;
  }).length;

  useEffect(() => {
    try {
      const remembered = JSON.parse(sessionStorage.getItem(navKey) || "null") as
        { screen?: Section; lessonLevel?: Level; dictionaryLevel?: Level; selectedSense?: string } | null;
      if (remembered?.screen && ["study", "explore", "me"].includes(remembered.screen)) {
        setScreen(remembered.screen);
      }
      if (remembered?.lessonLevel && isLevel(remembered.lessonLevel)) {
        setLessonLevel(remembered.lessonLevel);
      }
      if (remembered?.dictionaryLevel && isLevel(remembered.dictionaryLevel)) {
        setDictionaryLevel(remembered.dictionaryLevel);
      }
      if (remembered?.selectedSense) setSelectedSense(remembered.selectedSense);
    } catch { /* Navigation storage is optional. */ }

    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.substring(1));
    const authError = query.get("error_description") || hash.get("error_description")
      || query.get("error") || hash.get("error");
    if (authError) {
      setAuthFeedback("Authentication could not finish: " + authError.replace(/\+/g, " "));
      setScreen("me");
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(navKey, JSON.stringify({
        screen, lessonLevel, dictionaryLevel, selectedSense
      }));
    } catch { /* no data loss if browser blocks session storage */ }
  }, [screen, lessonLevel, dictionaryLevel, selectedSense]);

  useEffect(() => {
    let active = true;
    const loadFromCloud = async (user: User) => {
      if (!client) return;
      const { data, error } = await client.from("learner_states")
        .select("state").eq("user_id", user.id).maybeSingle();
      if (!active) return;
      if (error) {
        setSaveFeedback("Could not load personal progress: " + error.message);
        return;
      }
      const state = data?.state as Record<string, unknown> | undefined;
      setLearning(parseProgress(state?.[cloudKey]));
    };

    if (!client) {
      setLearning(guestRecord());
      setAuthReady(true);
      return;
    }

    void client.auth.getUser().then(async ({ data, error }) => {
      if (!active) return;
      if (error && error.name !== "AuthSessionMissingError") setAuthFeedback(error.message);
      setIdentity(data.user ?? null);
      if (data.user) await loadFromCloud(data.user);
      else setLearning(guestRecord());
      if (active) setAuthReady(true);
    }).catch((error: unknown) => {
      if (!active) return;
      setAuthReady(true);
      setAuthFeedback(error instanceof Error ? error.message : "Unable to contact authentication service.");
    });

    const { data: subscription } = client.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setIdentity(session?.user ?? null);
      if (session?.user) {
        // Avoid calling another Auth API synchronously inside the callback.
        Promise.resolve().then(() => { if (active) void loadFromCloud(session.user); });
      } else {
        setLearning(guestRecord());
      }
    });
    return () => { active = false; subscription.subscription.unsubscribe(); };
  }, [client]);

  useEffect(() => {
    if (screen !== "explore") return;
    const controller = new AbortController();
    let live = true;
    setLexiconError("");
    setLexiconFor(null);
    setLexicon(null);
    void fetch("/api/lexicon/" + dictionaryLevel, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Teaching library unavailable (" + response.status + ")");
        const data: unknown = await response.json();
        if (!data || typeof data !== "object" ||
          !("items" in data) || !Array.isArray((data as { items: unknown }).items)) {
          throw new Error("Unexpected library format");
        }
        const items = (data as { items: VerbSense[] }).items;
        if (items.length !== 456) throw new Error("Expected 456 source entries");
        if (live) { setLexicon(items); setLexiconFor(dictionaryLevel); }
      })
      .catch((error: unknown) => {
        if (live) setLexiconError(error instanceof Error ? error.message : "Could not load verbs");
      });
    return () => { live = false; controller.abort(); };
  }, [screen, dictionaryLevel]);

  const terms = search.trim().toLocaleLowerCase("sv-SE");
  const entries = lexiconFor === dictionaryLevel ? lexicon ?? [] : [];
  const results = useMemo(() => entries.filter((sense) => {
    const id = senseKey(sense);
    if (favoriteFilter && !learning.favorites.includes(id)) return false;
    if (!terms) return true;
    return [sense.v, sense.meaning, ...tenseCodes.flatMap((tense) => [
      sense.forms[tense]?.word ?? "", sense.forms[tense]?.sv ?? "", sense.forms[tense]?.en ?? ""
    ])].join(" ").toLocaleLowerCase("sv-SE").includes(terms);
  }), [entries, terms, favoriteFilter, learning.favorites]);

  // Stable sense key, not array index or spelling. This preserves both senses of sticka.
  const chosen = results.find((record) => senseKey(record) === selectedSense)
    ?? results[0] ?? null;

  async function updateLearning(change: ProgressRecord) {
    if (saving) return;
    setSaving(true);
    setSaveFeedback("");
    if (!client || !identity) {
      try {
        localStorage.setItem(guestKey, JSON.stringify(change));
        setLearning(change);
      } catch {
        setSaveFeedback("This browser cannot save guest learning state.");
      } finally {
        setSaving(false);
      }
      return;
    }
    const { data, error: readError } = await client.from("learner_states")
      .select("state").eq("user_id", identity.id).maybeSingle();
    if (readError) {
      setSaveFeedback("Save failed before updating progress: " + readError.message);
      setSaving(false);
      return;
    }
    const old = data?.state && typeof data.state === "object" && !Array.isArray(data.state)
      ? (data.state as Record<string, unknown>) : {};
    const { error } = await client.from("learner_states").upsert({
      user_id: identity.id,
      updated_at: new Date().toISOString(),
      state: { ...old, [cloudKey]: change }
    }, { onConflict: "user_id" });
    if (error) setSaveFeedback("Learning progress was not saved: " + error.message);
    else setLearning(change);
    setSaving(false);
  }

  function markAnswer(part: "comprehension" | "forms", option: number) {
    if (saving) return;
    const index = part === "comprehension" ? 0 : 1;
    const question = currentMission.quiz[index];
    const id = currentMission.id + ":" + part;
    const correct = option === question.correctIndex;
    setAnswerFeedback((previous) => ({
      ...previous, [id]: correct ? "Correct — this exercise is complete." : "Not quite. Look at the Swedish example and try again."
    }));
    if (!correct) return;
    const before = learning.completed[currentMission.id] ?? {
      comprehension: false, forms: false
    };
    if (before[part]) return;
    void updateLearning({
      ...learning,
      completed: {
        ...learning.completed,
        [currentMission.id]: { ...before, [part]: true }
      }
    });
  }

  function toggleFavorite(sense: VerbSense) {
    if (saving) return;
    const id = senseKey(sense);
    const next = learning.favorites.includes(id)
      ? learning.favorites.filter((favorite) => favorite !== id)
      : [...learning.favorites, id];
    void updateLearning({ ...learning, favorites: next });
  }

  function listen(swedish: string) {
    setAudioFeedback("");
    if (!("speechSynthesis" in window)) {
      setAudioFeedback("This browser cannot play speech.");
      return;
    }
    const synth = window.speechSynthesis;
    const say = () => {
      const voice = synth.getVoices().find((candidate) =>
        candidate.lang.toLowerCase().startsWith("sv")
      );
      if (!voice) {
        setAudioFeedback("Swedish voice not found. Install a Swedish browser/OS voice to enable listening.");
        return;
      }
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(swedish);
      utterance.lang = "sv-SE";
      utterance.voice = voice;
      utterance.rate = 0.9;
      utterance.onerror = (event) => {
        if (!["interrupted", "canceled"].includes(event.error)) {
          setAudioFeedback("Speech playback could not begin: " + event.error);
        }
      };
      synth.speak(utterance);
    };

    if (synth.getVoices().length) say();
    else {
      setAudioFeedback("Loading Swedish voices…");
      let done = false;
      const gotVoices = () => {
        if (done) return;
        done = true;
        synth.removeEventListener("voiceschanged", gotVoices);
        window.clearTimeout(fallback);
        setAudioFeedback("");
        say();
      };
      synth.addEventListener("voiceschanged", gotVoices);
      const fallback = window.setTimeout(gotVoices, 1300);
    }
  }

  async function emailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || authBusy) return;
    setAuthBusy(true);
    setAuthFeedback("");
    try {
      const outcome = authMode === "register"
        ? await client.auth.signUp({ email, password })
        : await client.auth.signInWithPassword({ email, password });
      if (outcome.error) setAuthFeedback(outcome.error.message);
      else if (authMode === "register" && !outcome.data.session) {
        setAuthFeedback("Check your email for a confirmation link before signing in.");
      } else {
        setPassword("");
        setAuthFeedback("Signed in successfully.");
      }
    } catch (error) {
      setAuthFeedback(error instanceof Error ? error.message : "Authentication service unavailable.");
    } finally { setAuthBusy(false); }
  }

  async function googleAuth() {
    if (!client || authBusy) return;
    setAuthBusy(true);
    setAuthFeedback("");
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/" }
      });
      if (error) {
        setAuthFeedback("Google sign-in unavailable: " + error.message);
        setAuthBusy(false);
      }
    } catch (error) {
      setAuthFeedback(error instanceof Error ? error.message : "Google login could not start.");
      setAuthBusy(false);
    }
  }

  async function signOut() {
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) setAuthFeedback(error.message);
    else { setScreen("me"); setAuthFeedback("Signed out."); }
  }

  const checks = learning.completed[currentMission.id] ?? {
    comprehension: false, forms: false
  };
  const subtitle = identity?.email ? identity.email : "Guest learner";

  return (
    <div className="site">
      <header className="top-nav">
        <button className="brand" onClick={() => setScreen("study")} aria-label="Nordljud home">
          <span className="brand-mark">N.</span><span><b>Nordljud</b><small>SWEDISH FOR REAL LIFE</small></span>
        </button>
        <nav className="nav-links" aria-label="Main navigation">
          <button aria-current={screen === "study" ? "page" : undefined}
            onClick={() => setScreen("study")}>Missions</button>
          <button aria-current={screen === "explore" ? "page" : undefined}
            onClick={() => setScreen("explore")}>Verb library</button>
          <button aria-current={screen === "me" ? "page" : undefined}
            onClick={() => setScreen("me")}>My learning</button>
        </nav>
        <button className="identity" onClick={() => setScreen("me")}>
          {identity ? "● " : "○ "}{subtitle}
        </button>
      </header>

      <section className="hero">
        <div><span className="eyebrow">YOUR EVERYDAY SWEDISH COMPANION</span>
          <h1>Make Swedish <i>part of your day.</i></h1>
          <p>Learn useful phrases in four short missions, then explore real Swedish verbs with examples at your level.</p>
          <button className="hero-cta" onClick={() => setScreen("study")}>Start a mission →</button>
        </div>
        <div className="hero-progress">
          <span>YOUR LEARNING SNAPSHOT</span>
          <strong>{completedMissions}<small> / 4</small></strong>
          <p>Missions completed</p>
          <div className="progress-track"><span style={{ width: (completedMissions * 25) + "%" }} /></div>
          <small>{identity ? "Saved to your personal account" : "Stored on this browser as a guest"}</small>
        </div>
      </section>

      {screen === "study" && <main className="study-layout">
        <aside className="levels-card">
          <span className="eyebrow">CHOOSE YOUR JOURNEY</span>
          <h2>Practice by level</h2>
          {levels.map((level) => {
            const lesson = lessons.find((one) => one.level === level);
            const completion = learning.completed[lesson?.id ?? ""];
            return <button key={level} className={"level-button " + (lessonLevel === level ? "active" : "")}
              aria-pressed={lessonLevel === level} onClick={() => {
                setLessonLevel(level);
                setAudioFeedback("");
              }}>
              <span>{level}</span><b>{lesson?.title}</b>
              {completion?.forms && completion?.comprehension && <em>✓</em>}
            </button>;
          })}
          <p className="sidebar-note">A little every day beats a perfect lesson once a month.</p>
        </aside>

        <div className="study-main">
          <div className="section-heading"><span className="eyebrow">MISSION {currentMission.level}</span>
            <h2>{currentMission.title}</h2><p>{currentMission.goal}</p></div>
          <div className="featured">TODAY'S WORD <b>{currentMission.target.v}</b>
            <span>{currentMission.target.meaning}</span></div>

          <section className="surface">
            <div className="surface-top"><div><span className="eyebrow">01 · READ AND LISTEN</span>
              <h3>Meet the language</h3></div>
              <button className="subtle-button" onClick={() => setRevealEnglish(!revealEnglish)}>
                {revealEnglish ? "Hide" : "Show"} English
              </button></div>
            {currentMission.exampleTenses.map((tense) => {
              const example = currentMission.target.forms[tense];
              const present = Boolean(example?.sv && example?.en);
              return <div className="example-row" key={tense}>
                <div className="form-name"><b>{tenseLabels[tense]}</b><span>{example?.word || "—"}</span></div>
                <div className="example-body">
                  {present ? <><p lang="sv">{example.sv}</p>
                    {revealEnglish && <small>{example.en}</small>}</>
                    : <small>This form has no verified source example.</small>}
                </div>
                <button disabled={!present} className="listen" aria-label={"Listen to " + (example?.sv || tense)}
                  onClick={() => listen(example.sv)}>▶</button>
              </div>;
            })}
            {audioFeedback && <p className="notice" role="status">{audioFeedback}</p>}
          </section>

          <section className="surface">
            <span className="eyebrow">02 · CHECK YOURSELF</span><h3>Put it into practice</h3>
            {currentMission.quiz.map((question, index) => {
              const part = index === 0 ? "comprehension" : "forms";
              const complete = checks[part];
              return <div className="question" key={part}>
                <div className="question-index"><b>Exercise {index + 1}</b>
                  {complete && <span className="complete">✓ Done</span>}</div>
                <p>{question.title}</p>
                <div className="choices">
                  {question.choices.map((choice, option) =>
                    <button key={option} disabled={saving || complete}
                      onClick={() => markAnswer(part, option)}>
                      <span>{String.fromCharCode(65 + option)}</span>{choice}
                    </button>)}
                </div>
                {answerFeedback[currentMission.id + ":" + part] &&
                  <p role="status" className={complete ? "complete" : "tip"}>
                    {answerFeedback[currentMission.id + ":" + part]}</p>}
              </div>;
            })}
            {checks.comprehension && checks.forms &&
              <p className="complete">Mission finished. Try a different level next!</p>}
          </section>
        </div>
      </main>}

      {screen === "explore" && <main className="library">
        <div className="section-heading"><span className="eyebrow">EXPLORE THE LANGUAGE</span>
          <h2>Your verb library</h2>
          <p>456 meaning-based entries (455 unique spellings), each with examples from A2 to C1.</p>
        </div>
        <div className="searchbar">
          <label>Search Swedish or English
            <input type="search" placeholder="Try arbeta, sticka or an English meaning"
              value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <label>Example level
            <select value={dictionaryLevel}
              onChange={(event) => setDictionaryLevel(event.target.value as Level)}>
              {levels.map((level) => <option key={level} value={level}>{level}</option>)}
            </select></label>
          <label className="checkbox-label"><input type="checkbox" checked={favoriteFilter}
            onChange={(event) => setFavoriteFilter(event.target.checked)} /> Favorites only</label>
        </div>
        <div className="explore-grid">
          <section className="lexicon-list">
            <div className="list-head"><strong>{lexiconFor === dictionaryLevel
              ? results.length + " matching entries" : "Loading level " + dictionaryLevel + "…"}</strong>
              <small>Tap an entry to see its Swedish forms</small></div>
            {lexiconError && <p className="notice" role="alert">{lexiconError}</p>}
            {lexiconFor === dictionaryLevel && results.map((sense) =>
              <div className={"sense-entry " + (sense === chosen ? "active" : "")}
                key={senseKey(sense)}>
                <button onClick={() => setSelectedSense(senseKey(sense))}>
                  <b>{sense.v}</b><small>{sense.meaning}</small></button>
                <button className="favorite" aria-pressed={learning.favorites.includes(senseKey(sense))}
                  aria-label={"Favorite " + sense.v + ", " + sense.meaning}
                  disabled={saving} onClick={() => toggleFavorite(sense)}>
                  {learning.favorites.includes(senseKey(sense)) ? "★" : "☆"}</button>
              </div>)}
            {lexiconFor === dictionaryLevel && results.length === 0 &&
              <p className="empty">No matching verbs. Try a different search.</p>}
          </section>

          <section className="surface detail">
            {lexiconFor !== dictionaryLevel ? <p>Loading examples…</p>
              : chosen ? <>
                <div className="detail-head"><div><span className="eyebrow">{dictionaryLevel} WORD FORMS</span>
                  <h3>{chosen.v}</h3><p>{chosen.meaning}</p></div>
                  <button className="favorite large" disabled={saving}
                    aria-label={"Favorite " + chosen.v + ", " + chosen.meaning}
                    onClick={() => toggleFavorite(chosen)}>
                    {learning.favorites.includes(senseKey(chosen)) ? "★" : "☆"}</button></div>
                <button className="subtle-button" onClick={() => setRevealEnglish(!revealEnglish)}>
                  {revealEnglish ? "Hide" : "Show"} English translations
                </button>
                {tenseCodes.map((tense) => {
                  const example = chosen.forms[tense];
                  const present = Boolean(example?.word && example?.sv && example?.en);
                  return <div className="example-row" key={tense}>
                    <div className="form-name"><b>{tenseLabels[tense]}</b>
                      <span>{example?.word || "—"}</span></div>
                    <div className="example-body">
                      {present ? <><p lang="sv">{example.sv}</p>
                        {revealEnglish && <small>{example.en}</small>}</>
                        : <small>No source example is available for this form.</small>}
                    </div>
                    <button className="listen" disabled={!present}
                      aria-label={"Listen to " + (example?.sv || tense)}
                      onClick={() => listen(example.sv)}>▶</button>
                  </div>;
                })}
                {audioFeedback && <p className="notice" role="status">{audioFeedback}</p>}
              </> : <p>Choose a verb on the left to begin.</p>}
          </section>
        </div>
      </main>}

      {screen === "me" && <main className="me">
        <div className="section-heading"><span className="eyebrow">YOUR PERSONAL STUDY SPACE</span>
          <h2>Small steps add up.</h2><p>Track missions and revisit words that matter to you.</p></div>
        <div className="me-grid">
          <section className="surface">
            <h3>My missions</h3>
            {lessons.map((lesson) => {
              const marks = learning.completed[lesson.id];
              const score = Number(Boolean(marks?.comprehension)) + Number(Boolean(marks?.forms));
              return <button className="mission-status" key={lesson.id}
                onClick={() => { setLessonLevel(lesson.level); setScreen("study"); }}>
                <b>{lesson.level} · {lesson.title}</b><span>{score}/2 exercises</span>
                <span className="progress-track"><span style={{ width: (score * 50) + "%" }} /></span>
              </button>;
            })}
            <h3 className="saved-heading">Saved verbs</h3>
            <p className="saved-words">{learning.favorites.length
              ? learning.favorites.map(displaySense).join(" · ")
              : "No favorites yet. Star a verb in the library to save it."}</p>
            <button className="subtle-button" onClick={() => setScreen("explore")}>Open verb library →</button>
          </section>
          <section className="surface account">
            {identity ? <><span className="eyebrow">SIGNED IN</span><h3>Welcome back</h3>
              <p>{identity.email || "Your Google account"}</p>
              <p>Your learning progress is saved to this personal account.</p>
              <button className="primary" onClick={() => void signOut()}>Sign out</button></>
              : <><span className="eyebrow">MY ACCOUNT</span><h3>Keep your progress</h3>
                <p>Try Nordljud as a guest, or sign in to sync your learning.</p>
                <button className="google" disabled={!client || !authReady || authBusy}
                  onClick={() => void googleAuth()}>Continue with Google</button>
                <div className="switch"><button className={authMode === "login" ? "active" : ""}
                  onClick={() => setAuthMode("login")}>Sign in</button>
                  <button className={authMode === "register" ? "active" : ""}
                    onClick={() => setAuthMode("register")}>Create account</button></div>
                <form onSubmit={(event) => void emailAuth(event)}>
                  <label>Email<input type="email" autoComplete="email" required value={email}
                    disabled={!client || authBusy} onChange={(event) => setEmail(event.target.value)} /></label>
                  <label>Password<input type="password" required minLength={6}
                    autoComplete={authMode === "register" ? "new-password" : "current-password"}
                    value={password} disabled={!client || authBusy}
                    onChange={(event) => setPassword(event.target.value)} /></label>
                  <button className="primary" disabled={!client || !authReady || authBusy}>
                    {authBusy ? "Please wait…" : authMode === "login" ? "Sign in" : "Create account"}
                  </button>
                </form>
                {!client && <p className="notice">Supabase login is not configured in this environment.</p>}
                <p className="fine">Guest progress remains on this browser and is not automatically merged into an account.</p>
              </>}
            {authFeedback && <p role="status" className="notice">{authFeedback}</p>}
          </section>
        </div>
      </main>}

      {saveFeedback && <p role="status" className="notice page-notice">{saveFeedback}</p>}
      <footer>Nordljud · SDD classroom edition · Swedish examples are not independently teacher-verified</footer>
    </div>
  );
}
