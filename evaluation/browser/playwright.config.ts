import { defineConfig } from "@playwright/test";
import path from "node:path";

/**
 * A single independent, guest-only functional black-box evaluator.
 * GitHub Actions checks out a METHOD implementation separately at ../source.
 * This file does not modify any A/B/C condition application.
 */
export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.ts",
  timeout: 30000,
  expect: { timeout: 8000 },
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    browserName: "chromium",
    headless: true,
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1",
    cwd: path.resolve(__dirname, "../../../source"),
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    timeout: 150000
  }
});
