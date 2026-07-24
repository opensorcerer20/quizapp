import { expect, test } from "@playwright/test";

/*
 * Requires a production export first:
 *   npm run build:web && npm run test:pwa
 *
 * Guards the workbox-config.js precache settings. Before those were fixed the
 * 3.3MB JS bundle was skipped for exceeding maximumFileSizeToCacheInBytes and
 * the icon fonts were skipped because globPatterns had no "ttf" - so the app
 * cached an HTML shell that could not boot offline.
 */

const BUNDLE_PATTERN = /_expo\/static\/js\/web\/entry-[^/]+\.js$/;
const ICON_FONT_PATTERN = /MaterialCommunityIcons\.[^/]+\.ttf$/;

/**
 * every path currently held in Cache Storage, across all caches. pathname
 * rather than url because workbox appends a ?__WB_REVISION__= query to
 * precached entries
 */
const listCachedPaths = () =>
  caches.keys().then(async (names) => {
    const paths: string[] = [];
    for (const name of names) {
      const cache = await caches.open(name);
      const requests = await cache.keys();
      paths.push(...requests.map((request) => new URL(request.url).pathname));
    }
    return paths;
  });

test.describe("offline PWA", () => {
  test("boots offline from precache with icon fonts intact", async ({ page, context }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("./");
    await expect(page.getByText("Sample Spanish Deck")).toBeVisible();

    // the worker has to be installed and done precaching before going offline,
    // otherwise this races the install step rather than testing the cache
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));
    await expect
      .poll(() => page.evaluate(listCachedPaths), { message: "waiting for precache to complete" })
      .toEqual(expect.arrayContaining([expect.stringMatching(BUNDLE_PATTERN)]));
    const cachedPaths = await page.evaluate(listCachedPaths);
    expect(cachedPaths.some((path) => ICON_FONT_PATTERN.test(path))).toBe(true);

    await context.setOffline(true);
    await page.reload();

    // app boots with no network at all
    await expect(page.getByText("Flashcard Library")).toBeVisible();
    await expect(page.getByText("Saved Decks")).toBeVisible();
    await expect(page.getByText("Sample Spanish Deck")).toBeVisible();
    await expect(page.getByTestId("menu-icon")).toBeVisible();

    // the icon element being present is not enough - it would still render as
    // tofu with the font missing, which is the actual bug being guarded here
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    await expect
      .poll(() => page.evaluate(() => document.fonts.check("16px MaterialCommunityIcons")), {
        message: "waiting for MaterialCommunityIcons to load from cache",
      })
      .toBe(true);

    expect(pageErrors).toEqual([]);
  });

  test("serves a non-root route offline via navigateFallback", async ({ page, context }) => {
    await page.goto("./");
    await expect(page.getByText("Sample Spanish Deck")).toBeVisible();
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined));
    await expect
      .poll(() => page.evaluate(listCachedPaths), { message: "waiting for precache to complete" })
      .toEqual(expect.arrayContaining([expect.stringMatching(BUNDLE_PATTERN)]));

    await context.setOffline(true);

    // web.output is "single", so this path only resolves if navigateFallback
    // hands back the precached index.html
    await page.goto("QuizScreen");
    await expect(page.getByText("Review Deck")).toBeVisible();
  });
});
