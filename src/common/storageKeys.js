/*
 * Storage keys and IndexedDB identifiers.
 *
 * Deliberately free of any react-native import so this module can be pulled
 * into plain-Node contexts (the Playwright tests) without dragging in the
 * native runtime. constants.js re-exports these for app code.
 */

// localStorage / IndexedDB keys, unchanged since the localStorage era so the
// one-time migration can copy by matching key
export const DECK_DATA_KEY = "DECK_DATA";
export const DECK_QA_KEY = "DECK_QA";
export const THEME_KEY = "THEME";

// set once the one-time localStorage -> IndexedDB copy has completed
export const STORAGE_MIGRATED_KEY = "STORAGE_MIGRATED";

export const DB_NAME = "flashcardlibrary";
export const DB_VERSION = 1;
export const DB_STORE = "kv";
