import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// These are black-box data invariants derived from the SDD specification.
function input(file) {
  return JSON.parse(readFileSync(new URL("../shared-content/" + file, import.meta.url)));
}
const levels = ["A2","B1","B2","C1"];
const books = Object.fromEntries(
  levels.map((lv) => [lv, input("verb-library/" + lv + ".json")])
);
const seeds = input("mission-seeds.json").missions;

test("FR-008: 456 source entries and exactly 455 unique spellings", () => {
  for (const lv of levels) {
    const data = books[lv];
    assert.equal(data.length, 456);
    assert.equal(new Set(data.map((v) => v.v)).size, 455);
    const homographs = data.filter((v) => v.v === "sticka");
    assert.equal(homographs.length, 2);
    assert.notEqual(homographs[0].meaning, homographs[1].meaning);
    assert.notEqual(homographs[0].forms.Pres.word, homographs[1].forms.Pres.word);
  }
});

test("FR-009: one stable identity per sense across changing CEFR level", () => {
  const identities = (lv) => books[lv].map((r) => JSON.stringify([r.v, r.meaning]));
  const reference = identities(levels[0]);
  assert.equal(new Set(reference).size, 456);
  for(const level of levels.slice(1)) assert.deepEqual(identities(level), reference);
  const arbeta = levels.map((lv) => books[lv].find((x) => x.v === "arbeta").forms.Pres.sv);
  assert.notEqual(arbeta[0], arbeta[3]);
});

test("FR-002/FR-003: four mission seeds match their unchanged source data", () => {
  assert.deepEqual(seeds.map((seed) => seed.level), levels);
  for(const seed of seeds) {
    const found = books[seed.level].find((x) => x.v === seed.verb);
    assert.ok(found, "No target for " + seed.id);
    for(const key of seed.formKeys) {
      assert.ok(found.forms[key].word);
      assert.ok(found.forms[key].sv);
      assert.ok(found.forms[key].en);
    }
  }
});

test("FR-010: never require examples absent in recovered records", () => {
  const blankFormExamples = books.A2.reduce((acc, word) => acc + Object.values(word.forms).filter((x) => !x.sv || !x.en).length, 0);
  assert.ok(blankFormExamples >= 1, "Expected to preserve source missing examples");
});
