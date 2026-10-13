import { expect, test } from "@playwright/test";

/**
 * One evaluator, three independently checked-out software constructions.
 * No account access, remote database writes, source-code patches, credentials,
 * or fake "successful login" are involved.
 */
const method = process.env.NORDLJUD_METHOD;
if (!["Vibe", "God_Mode", "SDD"].includes(method ?? "")) {
  throw Error("Set NORDLJUD_METHOD to Vibe, God_Mode or SDD");
}

const levelButton: Record<string, string> = {
  Vibe: ".level-button",
  God_Mode: ".level-item",
  SDD: ".level-button"
};
const selectedTarget: Record<string, string> = {
  Vibe: ".lesson-badges strong",
  God_Mode: ".mission-verb b",
  SDD: ".featured b"
};
const libraryNavigation: Record<string, string> = {
  Vibe: "Explore · 456 Verbs",
  God_Mode: "Verb library",
  SDD: "Verb library"
};
const listItem: Record<string, string> = {
  Vibe: ".verb-result",
  God_Mode: ".word-item",
  SDD: ".sense-entry"
};
const senseMeaning: Record<string, string> = {
  Vibe: ".verb-heading p",
  God_Mode: ".word-heading p",
  SDD: ".detail-head p"
};
const missions: Array<[string, string]> = [
  ["A2", "arbeta"],
  ["B1", "förklara"],
  ["B2", "föreslå"],
  ["C1", "påverka"]
];

test("F03/F04/F05 guest missions: all four CEFR levels show correct target and Swedish examples", async ({ page }) => {
  await page.goto("/");
  for (const [level, lemma] of missions) {
    const button = page.locator(levelButton[method!]).filter({
      has: page.getByText(level, { exact: true })
    }).first();
    await expect(button).toBeVisible();
    await button.click();
    await expect(page.locator(selectedTarget[method!])).toHaveText(lemma);
    await expect(page.locator('main p[lang="sv"]').first()).toBeVisible();
  }
});

test("G03 lexicon preserves both meanings of homograph sticka as selectable senses", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: libraryNavigation[method!], exact: true }).click();
  const input = page.locator('input[type="search"]').first();
  await expect(input).toBeVisible();
  await input.fill("sticka");
  const rows = page.locator(listItem[method!]).filter({
    has: page.getByText("sticka", { exact: true })
  });
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toContainText("knit");
  await expect(rows.nth(1)).toContainText("sting");
  await rows.nth(0).locator("button").first().click();
  await expect(page.locator(senseMeaning[method!])).toContainText("knit");
  await rows.nth(1).locator("button").first().click();
  await expect(page.locator(senseMeaning[method!])).toContainText("sting");
});
