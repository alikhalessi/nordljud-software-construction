import a2 from "../shared-content/verb-library/A2.json";
import b1 from "../shared-content/verb-library/B1.json";
import b2 from "../shared-content/verb-library/B2.json";
import c1 from "../shared-content/verb-library/C1.json";
import type { Level } from "./missions";

export const FORM_KEYS = ["Inf", "Imp", "Pres", "Pret", "Sup"] as const;
export type FormKey = (typeof FORM_KEYS)[number];

export type VerbForm = {
  word: string;
  sv: string;
  en: string;
};

export type VerbEntry = {
  v: string;
  frequency: string;
  meaning: string;
  forms: Record<FormKey, VerbForm>;
  page: number;
};

const byLevel: Record<Level, VerbEntry[]> = {
  A2: a2 as VerbEntry[],
  B1: b1 as VerbEntry[],
  B2: b2 as VerbEntry[],
  C1: c1 as VerbEntry[]
};

export function getVerbsForLevel(level: Level): VerbEntry[] {
  return byLevel[level];
}

export const FORM_LABELS: Record<FormKey, string> = {
  Inf: "Infinitiv · Infinitive",
  Imp: "Imperativ · Command",
  Pres: "Presens · Present",
  Pret: "Preteritum · Past",
  Sup: "Supinum · Perfect tense"
};
