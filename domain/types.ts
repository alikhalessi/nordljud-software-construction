export const LEVELS = ["A2", "B1", "B2", "C1"] as const;
export type Level = typeof LEVELS[number];

export const FORMS = ["Inf", "Imp", "Pres", "Pret", "Sup"] as const;
export type Tense = typeof FORMS[number];

export type SentenceForm = { word: string; sv: string; en: string };
export type SwedishVerb = {
  v: string;
  frequency: string;
  meaning: string;
  page: number;
  forms: Record<Tense, SentenceForm>;
};
export type Exercise = {
  prompt: string;
  options: string[];
  solution: number;
};
export type Lesson = {
  id: string;
  level: Level;
  title: string;
  goal: string;
  verb: string;
  meaning: string;
  examples: Array<{ tense: Tense; form: SentenceForm }>;
  questions: [Exercise, Exercise];
};
export type MissionResult = { meaning: boolean; form: boolean };
export type LearnerRecord = {
  missions: Record<string, MissionResult>;
  favorites: string[];
};
export const EMPTY_RECORD: LearnerRecord = { missions: {}, favorites: [] };
export const TENSE_NAMES: Record<Tense, string> = {
  Inf: "Infinitive", Imp: "Imperative", Pres: "Present",
  Pret: "Past", Sup: "Supine"
};
