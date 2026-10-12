import a2 from "../shared-content/verb-library/A2.json";
import b1 from "../shared-content/verb-library/B1.json";
import b2 from "../shared-content/verb-library/B2.json";
import c1 from "../shared-content/verb-library/C1.json";
import seed from "../shared-content/mission-seeds.json";

export type Level = "A2" | "B1" | "B2" | "C1";
type FormKey = "Inf" | "Imp" | "Pres" | "Pret" | "Sup";

type VerbForm = { word: string; sv: string; en: string };
type VerbEntry = {
  v: string;
  meaning: string;
  frequency: string;
  forms: Record<FormKey, VerbForm>;
};

export type Example = VerbForm & { key: FormKey; label: string };
export type Mission = {
  id: string;
  level: Level;
  title: string;
  goal: string;
  context: string;
  verb: string;
  meaning: string;
  examples: Example[];
  comprehension: { question: string; choices: string[]; correctIndex: number };
  verbQuestion: { question: string; choices: string[]; correctIndex: number };
};

const collections: Record<Level, VerbEntry[]> = {
  A2: a2 as VerbEntry[],
  B1: b1 as VerbEntry[],
  B2: b2 as VerbEntry[],
  C1: c1 as VerbEntry[]
};

const labels: Record<FormKey, string> = {
  Inf: "Infinitive",
  Imp: "Imperative",
  Pres: "Present",
  Pret: "Past",
  Sup: "Supine"
};

// The dataset and mission seeds are common inputs, not historical app source code.
export function getMissions(): Mission[] {
  return seed.missions.map((item) => {
    const level = item.level as Level;
    const verbs = collections[level];
    const chosen = verbs.find((entry) => entry.v === item.verb);
    if (!chosen) throw new Error("Missing shared mission verb: " + item.verb);

    const examples = (item.formKeys as FormKey[]).map((key) => ({
      key,
      label: labels[key],
      ...chosen.forms[key]
    })).filter((form) => form.sv && form.en);

    const chosenExample = examples.find((example) => example.key === "Pres") ?? examples[0];
    const distractors = verbs
      .filter((entry) => entry.v !== chosen.v && entry.forms.Pres?.en &&
        entry.forms.Pres.en !== chosenExample.en)
      .slice(0, 2).map((entry) => entry.forms.Pres.en);
    const choices = [chosenExample.en, ...distractors];

    const past = chosen.forms.Pret.word;
    const otherForms = [
      chosen.forms.Inf.word,
      chosen.forms.Pres.word,
      chosen.forms.Sup.word,
      chosen.forms.Imp.word
    ].filter((word) => word && word !== past);
    const uniqueOthers = [...new Set(otherForms)].slice(0, 2);
    const verbChoices = [past, ...uniqueOthers];
    if (examples.length < 2 || choices.length !== 3 || verbChoices.length !== 3) {
      throw new Error("Not enough shared content for mission " + item.id);
    }

    // Deterministic rotations avoid showing every correct answer as option A.
    const correctIndex = (["A2", "B1", "B2", "C1"].indexOf(level) + 1) % 3;
    const rotated = <T,>(values: T[], correct: T): { choices: T[]; correctIndex: number } => {
      const others = values.filter((value) => value !== correct);
      const shuffled = others.slice(0, 2);
      shuffled.splice(correctIndex, 0, correct);
      return { choices: shuffled, correctIndex };
    };
    const first = rotated(choices, chosenExample.en);
    const second = rotated(verbChoices, past);

    return {
      id: item.id,
      level,
      title: item.title,
      goal: item.learnerGoal,
      context: item.suggestedContext,
      verb: chosen.v,
      meaning: chosen.meaning,
      examples,
      comprehension: {
        question: "What does this sentence mean in English? " + chosenExample.sv,
        ...first
      },
      verbQuestion: {
        question: "Choose the past tense (preterite) of '" + chosen.v + "'.",
        ...second
      }
    };
  });
}
