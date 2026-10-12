/**
 * Condition C: generated from specs/001-nordljud-classroom, not copied from A/B.
 * VerbSense identity is the written lemma plus meaning, not just spelling.
 */
export const levels = ["A2", "B1", "B2", "C1"] as const;
export type Level = (typeof levels)[number];

export const tenseCodes = ["Inf", "Imp", "Pres", "Pret", "Sup"] as const;
export type TenseCode = (typeof tenseCodes)[number];
export const tenseLabels: Record<TenseCode, string> = {
  Inf: "Infinitive",
  Imp: "Imperative",
  Pres: "Present",
  Pret: "Preterite",
  Sup: "Supine"
};

export interface Example {
  word: string;
  sv: string;
  en: string;
}
export interface VerbSense {
  v: string;
  meaning: string;
  frequency: string;
  page: number;
  forms: Record<TenseCode, Example>;
}

export interface AnswerQuestion {
  title: string;
  choices: readonly string[];
  correctIndex: number;
}
export interface Lesson {
  id: string;
  level: Level;
  title: string;
  goal: string;
  target: VerbSense;
  exampleTenses: readonly TenseCode[];
  quiz: readonly [AnswerQuestion, AnswerQuestion];
}

export type TwoChecks = { comprehension: boolean; forms: boolean };
export interface ProgressRecord {
  completed: Record<string, TwoChecks>;
  favorites: string[];
}

export const blankProgress = (): ProgressRecord => ({
  completed: {}, favorites: []
});

export const isLevel = (input: string): input is Level =>
  (levels as readonly string[]).includes(input);

export const senseKey = (sense: Pick<VerbSense, "v" | "meaning">): string =>
  JSON.stringify([sense.v, sense.meaning]);

export function parseProgress(value: unknown): ProgressRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return blankProgress();
  }
  const obj = value as Record<string, unknown>;
  const checks: Record<string, TwoChecks> = {};
  if (typeof obj.completed === "object" && obj.completed && !Array.isArray(obj.completed)) {
    for (const [key, raw] of Object.entries(obj.completed)) {
      if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
        const r = raw as Record<string, unknown>;
        checks[key] = { comprehension: r.comprehension === true, forms: r.forms === true };
      }
    }
  }
  return {
    completed: checks,
    favorites: Array.isArray(obj.favorites)
      ? obj.favorites.filter((f): f is string => typeof f === "string")
      : []
  };
}
