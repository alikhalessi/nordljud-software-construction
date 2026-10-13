import { test, expect } from "@playwright/test";

// CR-SDD-02 acceptance tests. Auth may be unconfigured in CI; discoverability
// must be testable even without credentials. These do NOT prove OAuth works.
test("SC-009 desktop: one click from first screen reaches both sign-in methods", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /make swedish/i })).toBeVisible();
  const entry = page.getByRole("button", { name: "Sign in", exact: true });
  await expect(entry).toBeVisible();
  await entry.click();
  await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});

test("SC-009 mobile: an explicit sign-in button is visible on initial view", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const entry = page.getByRole("button", { name: "Sign in", exact: true });
  await expect(entry).toBeVisible();
  await expect(entry).toBeInViewport();
  await entry.click();
  await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
});

test("Existing auth controls remain available in My learning", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "My learning" }).click();
  await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});
