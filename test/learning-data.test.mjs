import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const load = (relativePath) => JSON.parse(
  readFileSync(new URL("../shared-content/" + relativePath, import.meta.url), "utf8")
);
const levels = ["A2", "B1", "B2", "C1"];
const seeds = load("mission-seeds.json").missions;
const sets = Object.fromEntries(levels.map((level) => [
  level, load("verb-library/" + level + ".json")
]));

test("The exact same 456 lemma identities exist at all four CEFR levels", () => {
  const reference = sets.A2.map((entry) => entry.v);
  assert.equal(reference.length, 456);
  assert.equal(new Set(reference).size, 456);
  for(const level of levels.slice(1)) {
    assert.deepEqual(sets[level].map((entry) => entry.v), reference);
  }
});

test("Four missions independently match shared seed data", () => {
  assert.deepEqual(seeds.map((seed) => seed.level), levels);
  for(const seed of seeds) {
    const target = sets[seed.level].find((v) => v.v === seed.verb);
    assert.ok(target, "Missing " + seed.level + "/" + seed.verb);
    for(const key of seed.formKeys) {
      assert.ok(target.forms[key].sv, "No Swedish example: " + key);
      assert.ok(target.forms[key].en, "No English example: " + key);
      assert.ok(target.forms[key].word, "No correct word form: " + key);
    }
    const possibilities = [target.forms.Inf.word, target.forms.Pres.word,
      target.forms.Sup.word, target.forms.Imp.word]
      .filter((x) => x && x !== target.forms.Pret.word);
    assert.ok(new Set(possibilities).size >= 2, "Past exercise needs two distractors");
  }
});

test("Level change retains lemma but updates example, including arbeta", () => {
  const lemma = "arbeta";
  const examples = levels.map((level) =>
    sets[level].find((entry) => entry.v === lemma)?.forms.Pres.sv
  );
  assert.ok(examples.every(Boolean));
  assert.notEqual(examples[0], examples[3]);
});
