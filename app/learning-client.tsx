"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import type { Level, Mission } from "../lib/missions";
import { getSupabase } from "../lib/supabase";
import VerbExplorer from "./verb-explorer";

type Score = { comprehension: boolean; verb: boolean };
type Progress = Record<string, Score>;
const GUEST_KEY = "nordljud-vibe-guest-v1";
const CLOUD_KEY = "nordljud_vibe_v1";
const CLOUD_FAVORITES_KEY = "nordljud_vibe_favorites_v1";
const GUEST_FAVORITES_KEY = "nordljud-vibe-guest-favorites-v1";
const NAV_SESSION_KEY = "nordljud-vibe-navigation-v1";
type GoogleStatus = "checking" | "enabled" | "disabled" | "unknown";
const LEVELS: Level[] = ["A2", "B1", "B2", "C1"];
const empty: Score = { comprehension: false, verb: false };

export default function LearningClient({ missions }: { missions: Mission[] }) {
  const [level, setLevel] = useState<Level>("A2");
  const [activeTab, setActiveTab] = useState<"today" | "explore" | "learning">("today");
  const [exploreLevel, setExploreLevel] = useState<Level>("A2");
  const [navRestored, setNavRestored] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<GoogleStatus>("checking");
  const [favorites, setFavorites] = useState<string[]>([]);
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

  // Keep the learner's current screen when navigating to Google or pressing Back.
  useEffect(() => {
    const legalTabs = ["today", "explore", "learning"] as const;
    const legalLevels: Level[] = ["A2", "B1", "B2", "C1"];
    try {
      const stored = sessionStorage.getItem(NAV_SESSION_KEY);
      if (stored) {
        const value = JSON.parse(stored) as {
          tab?: "today" | "explore" | "learning";
          level?: Level;
          exploreLevel?: Level;
        };
        if (value.tab && legalTabs.includes(value.tab)) setActiveTab(value.tab);
        if (value.level && legalLevels.includes(value.level)) setLevel(value.level);
        if (value.exploreLevel && legalLevels.includes(value.exploreLevel)) {
          setExploreLevel(value.exploreLevel);
        }
      }
    } catch {
      // The app still works if session storage is blocked.
    }

    // Supabase can return authentication errors as URL query or hash parameters.
    // Surface them on our page instead of silently returning to the first mission.
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const authError = query.get("error_description") || hash.get("error_description")
      || query.get("error") || hash.get("error");
    if (authError) {
      setAuthMessage("Google sign-in could not finish: " + authError.replace(/\+/g, " "));
      setActiveTab("learning");
    } else if (query.get("auth_return") === "google") {
      const targetTab = query.get("tab");
      if (targetTab && legalTabs.some((x) => x === targetTab)) {
        setActiveTab(targetTab as "today" | "explore" | "learning");
      }
      const targetLevel = query.get("explore_level");
      if (targetLevel && legalLevels.some((x) => x === targetLevel)) {
        setExploreLevel(targetLevel as Level);
      }
      setAuthMessage("Checking your Google sign-in…");
    }
    setNavRestored(true);

    // Browsers sometimes restore a page from the back-forward cache.
    const onPageShow = () => setAuthBusy(false);
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    if (!navRestored) return;
    try {
      sessionStorage.setItem(NAV_SESSION_KEY, JSON.stringify({
        tab: activeTab, level, exploreLevel
      }));
    } catch {
      // Session storage is optional.
    }
  }, [navRestored, activeTab, level, exploreLevel]);

  // Read only a sanitized provider status: never fetch or expose OAuth secrets.
  useEffect(() => {
    let active = true;
    fetch("/api/auth-status", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Provider status unavailable");
        return response.json() as Promise<{ google?: string }>;
      })
      .then((value) => {
        if (!active) return;
        if (value.google === "enabled" || value.google === "disabled") {
          setGoogleStatus(value.google);
        } else setGoogleStatus("unknown");
      })
      .catch(() => { if (active) setGoogleStatus("unknown"); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    function loadGuestData() {
      try {
        const saved = localStorage.getItem(GUEST_KEY);
        const storedFavorites = localStorage.getItem(GUEST_FAVORITES_KEY);
        setProgress(saved ? JSON.parse(saved) as Progress : {});
        setFavorites(storedFavorites ? JSON.parse(storedFavorites) as string[] : []);
      } catch {
        setProgress({});
        setFavorites([]);
      }
    }
    if (!supabase) {
      loadGuestData();
      setAuthReady(true);
      return;
    }

    let active = true;
    async function initialize() {
      const { data, error } = await supabase!.auth.getUser();
      if (!active) return;
      if (error && error.status !== 400 && error.name !== "AuthSessionMissingError") {
        setAuthMessage(error.message);
      }
      setUser(data.user ?? null);
      if (data.user) {
        await fetchProgress(data.user);
        if (window.location.search.includes("auth_return=google")) {
          setAuthMessage("Google sign-in successful. Welcome back!");
        }
      } else {
        loadGuestData();
        if (window.location.search.includes("auth_return=google")) {
          setAuthMessage("Google sign-in has not completed. Please check the provider configuration or try again.");
        }
      }
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
          const cloudFavorites = state?.[CLOUD_FAVORITES_KEY] as string[] | undefined;
          setProgress(saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {});
          setFavorites(Array.isArray(cloudFavorites) ? cloudFavorites.filter((x) => typeof x === "string") : []);
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
        loadGuestData();
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

  async function signInWithGoogle() {
    if (!supabase || authBusy) return;
    if (googleStatus === "disabled") {
      setAuthMessage(
        "Google sign-in is currently disabled in the Supabase project. The project owner must enable Google under Authentication → Providers and set the redirect URLs."
      );
      return;
    }
    setAuthBusy(true);
    setAuthMessage("");
    const callback = new URL("/", window.location.origin);
    callback.searchParams.set("auth_return", "google");
    callback.searchParams.set("tab", activeTab);
    callback.searchParams.set("explore_level", exploreLevel);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callback.toString() }
      });
      if (error) {
        setAuthMessage("Google sign-in failed: " + error.message);
        setAuthBusy(false);
      }
      // A successful response redirects via Supabase to Google's consent screen.
    } catch (error) {
      setAuthMessage("Google sign-in failed: " +
        (error instanceof Error ? error.message : "Unknown browser error"));
      setAuthBusy(false);
    }
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setAuthMessage(error.message);
    else {
      setProgress({});
      setFavorites([]);
      setAuthMessage("You signed out.");
    }
  }

  async function toggleFavorite(verb: string) {
    const next = favorites.includes(verb)
      ? favorites.filter((item) => item !== verb)
      : [...favorites, verb];
    setFavorites(next);
    setSaveError("");
    if (!supabase || !user) {
      try {
        localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(next));
      } catch {
        setSaveError("Favorites could not be saved on this browser.");
      }
      return;
    }
    setSaving(true);
    const { data, error: readError } = await supabase.from("learner_states")
      .select("state").eq("user_id", user.id).maybeSingle();
    if (readError) {
      setSaveError("Could not load favorites for saving: " + readError.message);
      setSaving(false);
      return;
    }
    const priorState = data?.state && typeof data.state === "object"
      ? data.state as Record<string, unknown> : {};
    const { error } = await supabase.from("learner_states").upsert({
      user_id: user.id,
      state: { ...priorState, [CLOUD_FAVORITES_KEY]: next },
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });
    if (error) setSaveError("Favorites could not be synced: " + error.message);
    setSaving(false);
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
    setActiveTab("today");
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
          {user ? <>
            <span className="user-email">{user.user_metadata?.full_name || user.email || "Signed in"}</span>
            <button className="small-button" onClick={() => void signOut()}>Sign out</button>
          </> : <button className="small-button" onClick={() => {
            setActiveTab("learning");
            document.getElementById("account-panel")?.scrollIntoView({ behavior: "smooth" });
          }}>Sign in</button>}
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

        <nav className="main-nav" aria-label="Main learning navigation">
          <button aria-current={activeTab === "today" ? "page" : undefined}
            className={activeTab === "today" ? "selected" : ""}
            onClick={() => setActiveTab("today")}>Today · Missions</button>
          <button aria-current={activeTab === "explore" ? "page" : undefined}
            className={activeTab === "explore" ? "selected" : ""}
            onClick={() => setActiveTab("explore")}>Explore · 456 Verbs</button>
          <button aria-current={activeTab === "learning" ? "page" : undefined}
            className={activeTab === "learning" ? "selected" : ""}
            onClick={() => setActiveTab("learning")}>My Learning</button>
        </nav>

        {activeTab === "today" && <div className="workspace">
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
        </div>}

        {activeTab === "explore" && (
          <VerbExplorer
            level={exploreLevel}
            onLevelChange={setExploreLevel}
            favorites={favorites}
            onToggleFavorite={(verb) => void toggleFavorite(verb)}
            onPlay={playSwedish}
            voiceMessage={voiceMessage}
          />
        )}

        {activeTab === "learning" && <section className="learning-dashboard">
          <div className="section-heading"><span className="eyebrow">YOUR SWEDISH LEARNING</span>
            <span className="mission-meta">{favorites.length} favorite verbs</span></div>
          <h2>My Learning</h2>
          <p className="lesson-intro">Track your completed missions and revisit your favorite Swedish verbs.</p>
          <div className="progress-grid">
            {missions.map((item) => {
              const value = progress[item.id];
              const steps = Number(!!value?.comprehension) + Number(!!value?.verb);
              return <button className="progress-card" key={item.id}
                onClick={() => chooseLevel(item.level)}>
                <strong>{item.level} · {item.title}</strong>
                <small>{steps} of 2 exercises completed</small>
                <span className="meter light"><span style={{width: steps * 50 + "%"}} /></span>
              </button>;
            })}
          </div>
          <div className="favorite-summary">
            <div><h3>★ My favorite verbs</h3>
              <p>{favorites.length ? favorites.slice(0, 18).join(" · ") : "Your favorites will appear here when you star verbs in Explore."}</p>
            </div>
            <button className="small-button" onClick={() => setActiveTab("explore")}>Explore verbs</button>
          </div>
          {saveError && <p className="feedback warning" role="alert">{saveError}</p>}
        </section>}

        {!user && <section className="account-panel" id="account-panel">
          <div><div className="eyebrow">YOUR LEARNING ACCOUNT</div><h2>Keep your progress with you.</h2>
            <p>{supabase ? "Use Google for a quick sign-in, or create an account using your email and password. Signed-in learners can sync missions and favorites." : "Guest mode is available. To enable Google and email sign-in, configure the Supabase connection in Vercel."}</p>
            <button className="text-button" onClick={() => setExplore(!explore)} aria-expanded={explore}>What is saved? {explore ? "−" : "+"}</button>
            {explore && <p className="micro-copy">Mission completion and favorite verbs are stored locally in Guest mode. Signed-in mode uses Supabase with per-user row-level security. Guest data is not automatically merged into an account.</p>}
          </div>
          <div className="auth-box">
            <button type="button" className="google-button"
              disabled={!supabase || !authReady || authBusy || googleStatus === "disabled"}
              onClick={() => void signInWithGoogle()}>
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.79 7.18l7.73 6C44.39 38.03 46.98 31.85 46.98 24.55z"/>
                <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.86 23.86 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6C30.03 37.64 27.29 38.5 24 38.5c-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
            {googleStatus === "disabled" && (
              <p className="feedback warning" role="status">
                Google login is disabled in Supabase. The project owner must enable the Google provider before this button can work.
              </p>
            )}
            {googleStatus === "checking" && <p className="micro-copy">Checking Google sign-in availability…</p>}
            <p className="auth-divider"><span>or use email and password</span></p>
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
