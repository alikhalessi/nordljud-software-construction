import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const load = (filename) => JSON.parse(readFileSync(new URL("../shared-content/" + filename, import.meta.url), "utf8"));
const seeds = load("mission-seeds.json");
const levels = ["A2", "B1", "B2", "C1"];

test("four mission seeds cover A2 through C1 once each", () => {
  assert.deepEqual(seeds.missions.map((m) => m.level), levels);
  assert.equal(new Set(seeds.missions.map((m) => m.id)).size, 4);
});

for (const level of levels) {
  const verbs = load("verb-library/" + level + ".json");
  const mission = seeds.missions.find((m) => m.level === level);
  test(level + " includes 456 unique verbs with Swedish and English examples", () => {
    assert.equal(verbs.length, 456);
    assert.equal(new Set(verbs.map((v) => v.v)).size, 456);
    assert.ok(verbs.every((v) => v.v && v.meaning && v.forms));
    assert.ok(verbs.every((v) => v.forms.Pres?.sv && v.forms.Pres?.en));
  });
  test(level + " mission verb and tense choices are available in source data", () => {
    const found = verbs.find((v) => v.v === mission.verb);
    assert.ok(found, "missing mission verb " + mission.verb);
    for (const form of mission.formKeys) {
      assert.ok(found.forms[form]?.word);
      assert.ok(found.forms[form]?.sv, "missing example " + form);
      assert.ok(found.forms[form]?.en, "missing translation " + form);
    }
    assert.ok(found.forms.Pret.word !== found.forms.Pres.word);
    const alternatives = new Set([found.forms.Inf.word,found.forms.Pres.word,found.forms.Sup.word,found.forms.Imp.word].filter(Boolean));
    alternatives.delete(found.forms.Pret.word);
    assert.ok(alternatives.size >= 2);
  });
}
