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

export const FORM_LABELS: Record<FormKey, string> = {
  Inf: "Infinitiv · Infinitive",
  Imp: "Imperativ · Command",
  Pres: "Presens · Present",
  Pret: "Preteritum · Past",
  Sup: "Supinum · Perfect tense"
};
