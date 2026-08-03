import { expect, test } from "@playwright/test";

// react-native-free module, so it imports cleanly into this node test process
import { DB_NAME, DB_STORE, STORAGE_MIGRATED_KEY } from "../../src/common/storageKeys";

// mimics exactly what the master (localStorage) build would have written
const OLD_DECK_ID = 424242;
const OLD_DECK_ID_2 = 515151;

const seedLocalStorage = `
  localStorage.setItem("DECK_DATA", JSON.stringify([
    { id: ${OLD_DECK_ID}, name: "Legacy Deck One", createdAt: 1700000000000 },
    { id: ${OLD_DECK_ID_2}, name: "Legacy Deck Two", createdAt: 1700000001000 }
  ]));
  localStorage.setItem("DECK_QA_${OLD_DECK_ID}", JSON.stringify({
    id: ${OLD_DECK_ID},
    questions: [
      { id: 1, q: "legacy question one", a: "legacy answer one", disabled: false },
      { id: 2, q: "legacy question two", a: "legacy answer two", disabled: false }
    ]
  }));
  localStorage.setItem("DECK_QA_${OLD_DECK_ID_2}", JSON.stringify({
    id: ${OLD_DECK_ID_2},
    questions: [
      { id: 1, q: "deck two q", a: "deck two a", disabled: false }
    ]
  }));
  localStorage.setItem("THEME", JSON.stringify("light"));
  localStorage.setItem("SOME_NON_JSON_KEY", "not-json{");
`;

type KvSnapshot = Record<string, any>;

// serialized and run in the browser via page.evaluate, so it cannot close over
// the module-scope constants - the db/store names are passed in as an argument
const readIdb = async ({ dbName, storeName }: { dbName: string; storeName: string }): Promise<KvSnapshot> => {
  const request = <T,>(req: IDBRequest<T>) =>
    new Promise<T>((res, rej) => {
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });

  const db = await new Promise<IDBDatabase>((res, rej) => {
    const req = indexedDB.open(dbName);
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });

  if (!db.objectStoreNames.contains(storeName)) {
    db.close();
    return {};
  }

  const store = db.transaction(storeName, "readonly").objectStore(storeName);
  const keys = await request(store.getAllKeys());
  const values = await request(store.getAll());
  db.close();

  const out: KvSnapshot = {};
  keys.forEach((key, i) => {
    out[String(key)] = values[i];
  });
  return out;
};

// convenience wrapper so call sites don't repeat the db/store argument
const readIdbSnapshot = (page: import("@playwright/test").Page) =>
  page.evaluate(readIdb, { dbName: DB_NAME, storeName: DB_STORE });

test("migrates real localStorage data into IndexedDB and keeps localStorage as backup", async ({ page }) => {
  await page.addInitScript(seedLocalStorage);
  await page.goto("/");

  // both legacy decks render from IndexedDB-backed reads
  await expect(page.getByText("Legacy Deck One")).toBeVisible();
  await expect(page.getByText("Legacy Deck Two")).toBeVisible();
  // demo deck must NOT be seeded, migrated data already exists
  await expect(page.getByText("Sample Spanish Deck")).toHaveCount(0);

  const idb = await readIdbSnapshot(page);
  expect(Object.keys(idb).sort()).toEqual(
    ["DECK_DATA", `DECK_QA_${OLD_DECK_ID}`, `DECK_QA_${OLD_DECK_ID_2}`, "SOME_NON_JSON_KEY", STORAGE_MIGRATED_KEY, "THEME"].sort()
  );
  expect(idb.DECK_DATA).toHaveLength(2);
  expect(idb[`DECK_QA_${OLD_DECK_ID}`].questions).toHaveLength(2);
  expect(idb[`DECK_QA_${OLD_DECK_ID}`].questions[0].q).toBe("legacy question one");
  expect(idb.THEME).toBe("light");
  expect(idb[STORAGE_MIGRATED_KEY]).toBe(1);
  // non-JSON value survived as a raw string rather than being dropped
  expect(idb.SOME_NON_JSON_KEY).toBe("not-json{");

  // localStorage left intact as rollback backup
  const lsKeys = await page.evaluate(() => Object.keys(localStorage).sort());
  expect(lsKeys).toContain("DECK_DATA");
  expect(lsKeys).toContain(`DECK_QA_${OLD_DECK_ID}`);

  // questions are readable through the app
  await page.getByText("Legacy Deck One").click();
  await expect(page.getByText("Card 1 of 2")).toBeVisible();
});

test("migration is idempotent across reloads", async ({ page }) => {
  await page.addInitScript(seedLocalStorage);
  await page.goto("/");
  await expect(page.getByText("Legacy Deck One")).toBeVisible();

  for (let i = 0; i < 3; i++) {
    await page.reload();
    await expect(page.getByText("Legacy Deck One")).toBeVisible();
    await expect(page.getByText("Legacy Deck Two")).toBeVisible();
  }

  const idb = await readIdbSnapshot(page);
  expect(idb.DECK_DATA).toHaveLength(2);
  expect(Object.keys(idb)).toHaveLength(6);
});

test("fresh install seeds the demo deck exactly once over repeated reloads", async ({ page }) => {
  await page.goto("/");
  for (let i = 0; i < 5; i++) {
    await page.reload();
    // must appear without any intermediate "no decks" state persisting
    await expect(page.getByText("Sample Spanish Deck")).toHaveCount(1);
    await expect(page.getByText("No decks in memory, please add a deck")).toHaveCount(0);
  }

  const idb = await readIdbSnapshot(page);
  const qaKeys = Object.keys(idb).filter((k) => k.startsWith("DECK_QA_"));
  expect(qaKeys).toHaveLength(1);
  expect(idb.DECK_DATA).toHaveLength(1);
});

test("writes persist to IndexedDB across a hard reload", async ({ page }) => {
  await page.addInitScript(seedLocalStorage);
  await page.goto("/");
  await expect(page.getByText("Legacy Deck One")).toBeVisible();

  // add a card to the legacy deck
  await page
    .getByTestId("deck-list")
    .getByTestId("deck-list-item")
    .first()
    .getByTestId("deck-settings-icon")
    .click();
  await expect(page.getByText("Deck: Legacy Deck Two")).toBeVisible();
  await page.getByTestId("fab").click();
  await page.getByTestId("question-input").fill("brand new question");
  await page.getByTestId("answer-input").fill("brand new answer");
  await page.getByTestId("submit").getByText("Add Question").click();
  await expect(page.getByText("Q: brand new question")).toBeVisible();

  await page.reload();
  const idb = await readIdbSnapshot(page);
  // list is sorted most-recent-first, so the first item is Legacy Deck Two (1 question)
  const questions = idb[`DECK_QA_${OLD_DECK_ID_2}`].questions;
  expect(questions).toHaveLength(2);
  expect(questions[1].q).toBe("brand new question");
  // the other deck is untouched
  expect(idb[`DECK_QA_${OLD_DECK_ID}`].questions).toHaveLength(2);
});

test("falls back to memory storage when IndexedDB is unavailable", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.addInitScript(`
    Object.defineProperty(window, "indexedDB", { value: undefined, configurable: true });
  `);
  await page.goto("/");

  // app still renders and seeds the demo deck into the memory backend
  await expect(page.getByText("Sample Spanish Deck")).toBeVisible();
  await page.getByText("Sample Spanish Deck").click();
  await expect(page.getByText("Card 1 of 29")).toBeVisible();

  expect(errors).toEqual([]);
});

test("falls back to memory storage when IndexedDB exists but cannot be opened", async ({ page }) => {
  // three navigations plus a form fill does not fit the default 15s budget
  test.slow();

  const logs: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => logs.push(message.text()));
  page.on("pageerror", (error) => pageErrors.push(error.message));

  // indexedDB is present but open() is refused - private-mode Firefox, blocked
  // third-party storage, exhausted quota. this reaches the storage.js fallback
  // through openDB rejecting, not the `typeof indexedDB === "undefined"` guard
  // covered by the test above
  await page.addInitScript(`
    Object.defineProperty(window, "indexedDB", {
      configurable: true,
      value: {
        open: () => {
          throw new DOMException("storage is blocked", "SecurityError");
        },
      },
    });
  `);
  // legacy data is present, but a broken backend means it cannot be migrated
  await page.addInitScript(seedLocalStorage);

  await page.goto("/");

  // degrades to the in-memory backend instead of crashing
  await expect(page.getByText("Sample Spanish Deck")).toBeVisible();
  await expect(page.getByTestId("deck-list")).toBeVisible();
  expect(logs.some((line) => line.startsWith("persistent storage unavailable, falling back to memory"))).toBe(true);

  // the migration never ran, so the legacy decks are not visible - the memory
  // backend is a crash guard, not a second persistence tier
  await expect(page.getByText("Legacy Deck One")).toHaveCount(0);
  expect(logs.some((line) => line.startsWith("storage migration:"))).toBe(false);

  // writes are accepted but session-only: add a card, then reload
  await page
    .getByTestId("deck-list")
    .getByTestId("deck-list-item")
    .first()
    .getByTestId("deck-settings-icon")
    .click();
  await page.getByTestId("fab").click();
  await page.getByTestId("question-input").fill("in memory only");
  await page.getByTestId("answer-input").fill("gone after reload");
  await page.getByTestId("submit").getByText("Add Question").click();
  await expect(page.getByText("Q: in memory only")).toBeVisible();

  // a fresh document navigation discards the in-memory backend. note this has
  // to be goto("/") rather than reload() - reload would re-load DeckScreen,
  // since that is the current route
  await page.goto("/");
  await page
    .getByTestId("deck-list")
    .getByTestId("deck-list-item")
    .first()
    .getByTestId("deck-settings-icon")
    .click();
  await expect(page.getByTestId("deck-screen-list")).toBeVisible();
  await expect(page.getByText("Q: in memory only")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});
