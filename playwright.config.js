// @ts-check
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright-tests/tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  use: {
    // Port 8081 is the default port for Expo web
    baseURL: "http://localhost:8181",
    trace: "on-first-retry",
  },
  // Automatically spin up the Expo dev server before running tests
  webServer: {
    command: "npx expo start --port 8181 --web",
    url: "http://localhost:8181",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  // Emulate mobile viewports to simulate the mobile app feel
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
    // {
    //   name: "Mobile Safari",
    //   use: { ...devices["iPhone 13"] },
    // },
    // {
    //   name: "Mobile Chrome",
    //   use: { ...devices["Pixel 5"] },
    // },
  ],
});
