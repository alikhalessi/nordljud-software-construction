import { LEVELS, type Level, type Lesson, type SwedishVerb, type Tense } from "./types";
import A2 from "../shared-content/verb-library/A2.json";
import B1 from "../shared-content/verb-library/B1.json";
import B2 from "../shared-content/verb-library/B2.json";
import C1 from "../shared-content/verb-library/C1.json";
import missions from "../shared-content/mission-seeds.json";

const records: Record<Level, SwedishVerb[]> = {
  A2: A2 as SwedishVerb[],
  B1: B1 as SwedishVerb[],
  B2: B2 as SwedishVerb[],
  C1: C1 as SwedishVerb[]
};

// Favor stable identity and reproducible exercise choices over random ordering.
function options(correct: string, candidates: string[], level: Level): {
  options: string[]; solution: number;
} {
  const other = [...new Set(candidates.filter((x) => x && x !== correct))].slice(0, 2);
  if (other.length < 2) {
    throw new Error("Insufficient non-duplicate choices at " + level);
  }
  const solution = LEVELS.indexOf(level) % 3;
  other.splice(solution, 0, correct);
  return { options: other, solution };
}

export function library(level: Level): SwedishVerb[] {
  return records[level];
}

export function lessons(): Lesson[] {
  return missions.missions.map((seed) => {
    const level = seed.level as Level;
    const entries = records[level];
    const selected = entries.find((item) => item.v === seed.verb);
    if (!selected) throw new Error("Unknown target verb: " + seed.verb);

    const examples = (seed.formKeys as Tense[])
      .map((tense) => ({ tense, form: selected.forms[tense] }))
      .filter((x) => x.form.sv.trim() && x.form.en.trim());

    const present = selected.forms.Pres;
    const alternateTranslations = entries
      .filter((entry) => entry.v !== selected.v &&
        entry.forms.Pres?.en && entry.forms.Pres.en !== present.en)
      .map((entry) => entry.forms.Pres.en);
    const translation = options(present.en, alternateTranslations, level);
    const preterite = selected.forms.Pret.word;
    const otherTenses = (["Inf", "Pres", "Sup", "Imp"] as const)
      .map((tense) => selected.forms[tense].word);
    const past = options(preterite, otherTenses, level);

    return {
      id: seed.id,
      level,
      title: seed.title,
      goal: seed.learnerGoal,
      verb: selected.v,
      meaning: selected.meaning,
      examples,
      questions: [
        { prompt: "Choose the English meaning of: " + present.sv, ...translation },
        { prompt: "Which form is the preterite (past) of '" + selected.v + "'?", ...past }
      ]
    };
  });
}
