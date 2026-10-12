"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Level } from "../lib/missions";
import { FORM_KEYS, FORM_LABELS, type VerbEntry } from "../lib/verb-types";

const LEVELS: Level[] = ["A2", "B1", "B2", "C1"];
const PAGE_SIZE = 28;
const EXPLORER_SESSION = "nordljud-vibe-explorer-ui-v1";

type Props = {
  level: Level;
  onLevelChange: (level: Level) => void;
  favorites: string[];
  onToggleFavorite: (verb: string) => void;
  onPlay: (sentence: string) => void;
  voiceMessage: string;
};

const normalize = (input: string) => input.toLocaleLowerCase("sv-SE").trim();

export default function VerbExplorer({
  level,
  onLevelChange,
  favorites,
  onToggleFavorite,
  onPlay,
  voiceMessage
}: Props) {
  const [query, setQuery] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selectedVerb, setSelectedVerb] = useState("arbeta");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [entries, setEntries] = useState<VerbEntry[]>([]);
  const [loadedLevel, setLoadedLevel] = useState<Level | null>(null);
  const [restored, setRestored] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [englishVisible, setEnglishVisible] = useState(true);
  const cache = useRef<Partial<Record<Level, VerbEntry[]>>>({});

  // Remember the chosen verb when the learner navigates away or returns from OAuth.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(EXPLORER_SESSION);
      if (raw) {
        const value = JSON.parse(raw) as {
          query?: string;
          selectedVerb?: string;
          onlyFavorites?: boolean;
          englishVisible?: boolean;
        };
        if (typeof value.query === "string") setQuery(value.query);
        if (typeof value.selectedVerb === "string") setSelectedVerb(value.selectedVerb);
        if (typeof value.onlyFavorites === "boolean") setOnlyFavorites(value.onlyFavorites);
        if (typeof value.englishVisible === "boolean") setEnglishVisible(value.englishVisible);
      }
    } catch {
      // Session storage may be blocked. The explorer is still usable.
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(EXPLORER_SESSION, JSON.stringify({
        query, selectedVerb, onlyFavorites, englishVisible
      }));
    } catch {
      // Storage permissions never block the lessons.
    }
  }, [restored, query, selectedVerb, onlyFavorites, englishVisible]);

  useEffect(() => {
    let mounted = true;
    const previous = cache.current[level];
    if (previous) {
      setEntries(previous);
      setLoadedLevel(level);
      setLoading(false);
      setError("");
      return () => { mounted = false; };
    }
    setLoading(true);
    setError("");
    setEntries([]);
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/verbs/" + level, { signal: controller.signal });
        if (!response.ok) throw new Error("HTTP " + response.status);
        const data = await response.json() as { verbs?: VerbEntry[] };
        if (!Array.isArray(data.verbs)) throw new Error("Invalid verb library response");
        if (!mounted) return;
        cache.current[level] = data.verbs;
        setEntries(data.verbs);
        setLoadedLevel(level);
      } catch (cause) {
        if (!mounted || controller.signal.aborted) return;
        setError("Could not load the " + level + " library. Please try again. " +
          (cause instanceof Error ? cause.message : ""));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void load();
    return () => { mounted = false; controller.abort(); };
  }, [level]);

  // Never display a previous level's examples as if they belonged to the new level.
  const visibleEntries = loadedLevel === level ? entries : [];

  const filtered = useMemo(() => {
    const needle = normalize(query);
    return visibleEntries.filter((entry) => {
      if (onlyFavorites && !favorites.includes(entry.v)) return false;
      if (!needle) return true;
      return [entry.v, entry.meaning, ...FORM_KEYS.flatMap((k) => [
        entry.forms[k]?.word ?? "", entry.forms[k]?.sv ?? "", entry.forms[k]?.en ?? ""
      ])].some((part) => normalize(part).includes(needle));
    });
  }, [visibleEntries, query, onlyFavorites, favorites]);

  // The same base verbs exist at all four levels. Keep the selected verb fixed
  // while switching levels; only its example sentences and level label change.
  const selected = (selectedVerb
    ? visibleEntries.find((entry) => entry.v === selectedVerb)
    : undefined) ?? filtered[0] ?? null;

  function chooseLevel(next: Level) {
    onLevelChange(next);
    setLimit(PAGE_SIZE);
    // Do not reset selectedVerb. This was the source of the reported bug.
  }

  return (
    <section className="explorer-page" aria-label="Swedish verb library">
      <div className="section-heading">
        <span className="eyebrow">EXPLORE · FULL VERB LIBRARY</span>
        <span className="mission-meta">456 unique verbs · A2—C1</span>
      </div>
      <h2>Every word has a story.</h2>
      <p className="lesson-intro">Search all 456 verbs, switch sentence difficulty and listen to useful real-world examples.</p>

      <div className="explorer-controls">
        <label className="search-wrap" htmlFor="verb-search">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            id="verb-search" type="search" value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedVerb(""); setLimit(PAGE_SIZE); }}
            placeholder="Search Swedish or English…" autoComplete="off"
          />
        </label>
        <label className="control-label" htmlFor="explore-level">
          Sentences at
          <select id="explore-level" value={level} onChange={(e) => chooseLevel(e.target.value as Level)}>
            {LEVELS.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>
        <label className="favorite-filter">
          <input type="checkbox" checked={onlyFavorites}
            onChange={(event) => { setOnlyFavorites(event.target.checked); setSelectedVerb(""); setLimit(PAGE_SIZE); }}/>
          Favorites ({favorites.length})
        </label>
      </div>

      <div className="explorer-grid">
        <div className="verb-results">
          <div className="results-heading">
            <strong>{(loading || loadedLevel !== level) ? "Loading…" : filtered.length + " verbs"}</strong>
            <small>Tap a verb to study its five forms</small>
          </div>
          {error && <p role="alert" className="feedback warning">{error}</p>}
          {!loading && loadedLevel === level && !error && filtered.length === 0 && (
            <p className="empty-state">No matching verbs. Try another search or turn off Favorites.</p>
          )}
          {visibleEntries.length > 0 && filtered.slice(0, limit).map((entry) => (
            <div key={entry.v} className={"verb-result " + (selected?.v === entry.v ? "is-selected" : "")}>
              <button className="verb-select" onClick={() => setSelectedVerb(entry.v)}
                aria-pressed={selected?.v === entry.v}>
                <strong>{entry.v}</strong><small>{entry.meaning}</small>
              </button>
              <button className="favorite-star" type="button"
                onClick={() => onToggleFavorite(entry.v)}
                aria-pressed={favorites.includes(entry.v)}
                aria-label={(favorites.includes(entry.v) ? "Remove " : "Add ") + entry.v + (favorites.includes(entry.v) ? " from" : " to") + " favorites"}>
                {favorites.includes(entry.v) ? "★" : "☆"}
              </button>
            </div>
          ))}
          {filtered.length > limit && <button className="load-more" onClick={() => setLimit((n) => n + PAGE_SIZE)}>
            Show more verbs ({filtered.length - limit} remaining)
          </button>}
        </div>

        <article className="verb-detail" aria-live="polite">
          {selected ? (
            <>
              <div className="verb-heading">
                <div><div className="eyebrow">{level} · VERB DETAILS</div>
                  <h3 lang="sv">{selected.v}</h3>
                  <p>{selected.meaning}</p>
                </div>
                <button className="favorite-star large" type="button"
                  aria-pressed={favorites.includes(selected.v)}
                  aria-label={favorites.includes(selected.v) ? "Remove from favorites" : "Add to favorites"}
                  onClick={() => onToggleFavorite(selected.v)}>
                  {favorites.includes(selected.v) ? "★" : "☆"}
                </button>
              </div>
              <div className="verb-toolbar">
                <span>Five forms · {level} example sentences</span>
                <button className="small-button" onClick={() => setEnglishVisible(!englishVisible)}>
                  {englishVisible ? "Hide English" : "Show English"}
                </button>
              </div>
              {FORM_KEYS.map((key) => {
                const form = selected.forms[key];
                const available = Boolean(form?.sv?.trim() && form?.en?.trim() &&
                  !form.sv.includes("(not used as a command)"));
                return <div className="verb-form-row" key={key}>
                  <div className="form-tag"><strong lang="sv">{form?.word && form.word !== "—" ? form.word : "—"}</strong>
                    <small>{FORM_LABELS[key]}</small>
                  </div>
                  <div className="example-text">
                    {available ? <>
                      <p lang="sv">{form.sv}</p>
                      {englishVisible && <small>{form.en}</small>}
                    </> : <p className="unavailable-form">Not normally used or no verified example is available for this form.</p>}
                  </div>
                  <button type="button" className="audio-button" disabled={!available}
                    aria-label={"Listen to " + selected.v + ", " + FORM_LABELS[key]}
                    onClick={() => onPlay(form.sv)}>▶</button>
                </div>;
              })}
              {voiceMessage && <p role="status" className="feedback warning">{voiceMessage}</p>}
              <p className="micro-copy">These sentences come from the recovered teaching dataset and still require teacher review. Audio uses your browser&apos;s Swedish voice.</p>
            </>
          ) : <p className="empty-state">{(loading || loadedLevel !== level) ? "Loading verb details…" : "Choose a verb to see examples."}</p>}
        </article>
      </div>
    </section>
  );
}
