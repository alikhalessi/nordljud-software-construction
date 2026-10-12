import a2 from "../shared-content/verb-library/A2.json";
import b1 from "../shared-content/verb-library/B1.json";
import b2 from "../shared-content/verb-library/B2.json";
import c1 from "../shared-content/verb-library/C1.json";
import seeds from "../shared-content/mission-seeds.json";
import {
  isLevel, type Level, type Lesson, type VerbSense, type TenseCode
} from "./domain";

const books: Record<Level, VerbSense[]> = {
  A2: a2 as VerbSense[],
  B1: b1 as VerbSense[],
  B2: b2 as VerbSense[],
  C1: c1 as VerbSense[]
};

/** On the server, select a frozen corpus without modifying any source examples. */
export function corpus(level: Level): readonly VerbSense[] {
  return books[level];
}

function multipleChoice(correct: string, distractors: string[], offset: number) {
  const unique = [...new Set(distractors.filter((x) => x !== correct && x.trim().length))];
  if (unique.length < 2) throw Error("Not enough distinct source answer choices");
  const alternatives = unique.slice(0, 2);
  const slot = offset % 3;
  alternatives.splice(slot, 0, correct);
  return { choices: alternatives, correctIndex: slot };
}

export function buildLessons(): Lesson[] {
  return seeds.missions.map((seed, order) => {
    if (!isLevel(seed.level)) throw Error("Invalid seed level " + seed.level);
    const items = books[seed.level];
    const target = items.find((record) => record.v === seed.verb);
    if (!target) throw Error("Target missing from " + seed.level);

    const comprehension = multipleChoice(
      target.forms.Pres.en,
      items.filter((v) => v.v !== target.v).map((v) => v.forms.Pres.en),
      order
    );
    const forms = multipleChoice(
      target.forms.Pret.word,
      [target.forms.Pres.word, target.forms.Sup.word,
        target.forms.Inf.word, target.forms.Imp.word],
      order + 1
    );
    return {
      id: seed.id,
      title: seed.title,
      level: seed.level,
      goal: seed.learnerGoal,
      target,
      exampleTenses: (seed.formKeys as TenseCode[]),
      quiz: [
        { title: "What does this mean? " + target.forms.Pres.sv, ...comprehension },
        { title: "Choose the preterite (past) form of " + target.v + ":", ...forms }
      ]
    };
  });
}
