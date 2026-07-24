// @ts-check
import { defineConfig, devices } from "@playwright/test";

/*
 * Offline / service worker tests. Deliberately separate from playwright.config.js:
 * these need a production export ("npm run build:web") rather than the dev server,
 * so they are not part of the default "npm test" run.
 */
export default defineConfig({
  testDir: __dirname,
  fullyParallel: false,
  // one worker: service worker registration is per-origin and easier to reason
  // about without concurrent contexts racing over the same caches
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  timeout: 60000,
  use: {
    // localhost is a secure context, so service workers are allowed
    baseURL: "http://localhost:8281/flashcard_library/",
    trace: "on-first-retry",
    actionTimeout: 15000,
    navigationTimeout: 20000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "node serve-dist.js",
    cwd: __dirname,
    url: "http://localhost:8281/flashcard_library/",
    reuseExistingServer: !process.env.CI,
    timeout: 30 * 1000,
  },
  expect: {
    timeout: 20000,
  },
});
