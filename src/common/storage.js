import { openDB } from "idb";
import { Platform } from "react-native";

import { DB_NAME, DB_STORE, DB_VERSION, STORAGE_MIGRATED_KEY } from "./constants";

/*
 * Async key/value storage.
 *
 * web    -> IndexedDB (single "kv" object store, out-of-line string keys)
 * native -> AsyncStorage
 * neither available (private mode, etc) -> in-memory, session only
 *
 * Keys are the same strings previously used with localStorage (DECK_DATA,
 * DECK_QA_<id>, THEME), so callers keep their shape. On first web load after
 * upgrading, everything in localStorage is copied into IndexedDB once.
 */

const IS_WEB = Platform.OS === "web";

// upper bound for a "starts with" key range
const PREFIX_END = "￿";

const makeMemoryBackend = () => {
  const map = new Map();
  return {
    name: "memory",
    get: async (key) => map.get(key),
    set: async (key, value) => {
      map.set(key, value);
      return true;
    },
    remove: async (key) => {
      map.delete(key);
      return true;
    },
    keys: async () => Array.from(map.keys()),
    hasKey: async (key, startsWith) => {
      if (!startsWith) return map.has(key);
      return Array.from(map.keys()).some((thisKey) => thisKey.indexOf(key) === 0);
    },
  };
};

const makeIdbBackend = async () => {
  if (typeof indexedDB === "undefined") {
    throw new Error("indexedDB unavailable");
  }

  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(upgradeDb) {
      if (!upgradeDb.objectStoreNames.contains(DB_STORE)) {
        upgradeDb.createObjectStore(DB_STORE);
      }
    },
  });

  return {
    name: "indexeddb",
    db,
    get: (key) => db.get(DB_STORE, key),
    set: async (key, value) => {
      await db.put(DB_STORE, value, key);
      return true;
    },
    remove: async (key) => {
      await db.delete(DB_STORE, key);
      return true;
    },
    keys: () => db.getAllKeys(DB_STORE),
    hasKey: async (key, startsWith) => {
      if (!startsWith) {
        const found = await db.getKey(DB_STORE, key);
        return found !== undefined;
      }
      const count = await db.count(DB_STORE, IDBKeyRange.bound(key, key + PREFIX_END));
      return count > 0;
    },
  };
};

const makeAsyncStorageBackend = async () => {
  // required lazily so the web bundle never pulls in the native module
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;

  // AsyncStorage is string-only, so this backend owns serialization
  return {
    name: "asyncstorage",
    get: async (key) => {
      const raw = await AsyncStorage.getItem(key);
      if (raw === null) return undefined;
      try {
        return JSON.parse(raw);
      } catch (e) {
        // value was written as a bare string at some point
        return raw;
      }
    },
    set: async (key, value) => {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    },
    remove: async (key) => {
      await AsyncStorage.removeItem(key);
      return true;
    },
    keys: async () => Array.from(await AsyncStorage.getAllKeys()),
    hasKey: async (key, startsWith) => {
      const allKeys = Array.from(await AsyncStorage.getAllKeys());
      if (!startsWith) return allKeys.indexOf(key) > -1;
      return allKeys.some((thisKey) => thisKey.indexOf(key) === 0);
    },
  };
};

/**
 * One-time copy of localStorage into IndexedDB.
 *
 * Everything is written in a single readwrite transaction along with the
 * migrated flag, so an interrupted copy leaves the flag unset and simply
 * runs again on the next load. localStorage is deliberately left in place
 * as a rollback backup.
 */
const migrateFromLocalStorage = async (backend) => {
  if (!IS_WEB || backend.name !== "indexeddb") return;

  try {
    const alreadyMigrated = await backend.get(STORAGE_MIGRATED_KEY);
    if (alreadyMigrated) return;

    if (typeof localStorage === "undefined") {
      await backend.set(STORAGE_MIGRATED_KEY, 1);
      return;
    }

    const oldKeys = Object.keys(localStorage);
    const entries = oldKeys.map((key) => {
      const raw = localStorage.getItem(key);
      let value = raw;
      try {
        value = JSON.parse(raw);
      } catch (e) {
        // not JSON, keep the raw string rather than dropping the key
      }
      return [key, value];
    });

    const tx = backend.db.transaction(DB_STORE, "readwrite");
    await Promise.all([
      ...entries.map(([key, value]) => tx.store.put(value, key)),
      tx.store.put(1, STORAGE_MIGRATED_KEY),
      tx.done,
    ]);

    console.log(`storage migration: copied ${entries.length} key(s) from localStorage to IndexedDB`);
  } catch (e) {
    // leave the flag unset so this is retried on the next load
    console.log("storage migration failed: " + (e?.message ?? e));
  }
};

let backendPromise = null;

const buildBackend = async () => {
  try {
    const backend = IS_WEB ? await makeIdbBackend() : await makeAsyncStorageBackend();
    await migrateFromLocalStorage(backend);
    return backend;
  } catch (e) {
    console.log("persistent storage unavailable, falling back to memory: " + (e?.message ?? e));
    return makeMemoryBackend();
  }
};

/**
 * Opens the backend and runs the migration. Memoized, so it is safe (and
 * expected) for every public call below to await it first - that is what
 * guarantees nothing reads storage before the migration has finished.
 */
export const initStorage = () => {
  if (!backendPromise) {
    backendPromise = buildBackend();
  }
  return backendPromise;
};

export const getItem = async (key) => {
  const backend = await initStorage();
  return backend.get(key);
};

export const setItem = async (key, value) => {
  const backend = await initStorage();
  return backend.set(key, value);
};

export const removeItem = async (key) => {
  const backend = await initStorage();
  return backend.remove(key);
};

export const hasKey = async (key, startsWith = false) => {
  const backend = await initStorage();
  return backend.hasKey(key, startsWith);
};
