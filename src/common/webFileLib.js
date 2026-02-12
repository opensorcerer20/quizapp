// Simple IndexedDB-based storage for web PWAs
// Provides save/load/remove by key with error handling.

const DB_NAME = "FlashcardLibrary";
const STORE_NAME = "storage";

function openDB() {
	return new Promise((resolve, reject) => {
		try {
			if (!("indexedDB" in globalThis)) {
				console.log("IndexedDB not available in this environment");
				return resolve(false);
			}
			const request = indexedDB.open(DB_NAME, 1);
			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					db.createObjectStore(STORE_NAME, { keyPath: "key" });
				}
			};
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		} catch (e) {
			reject(e);
		}
	});
}

export const saveStorageData = async (key, value) => {
	try {
		const db = await openDB();
		if (!db) return false;
		return await new Promise((resolve) => {
			try {
				const tx = db.transaction(STORE_NAME, "readwrite");
				const store = tx.objectStore(STORE_NAME);
				store.put({ key, value });
				tx.oncomplete = () => resolve(true);
				tx.onerror = () => {
					console.log(`error saving data with key ${key}, error keys ` + JSON.stringify(Object.keys(tx.error || {})));
					resolve(false);
				};
			} catch (e) {
				console.log(`error saving data with key ${key}: `, e);
				resolve(false);
			}
		});
	} catch (e) {
		console.log(`error opening DB for save with key ${key}: `, e);
	}
	return false;
};

export const loadStorageData = async (key) => {
	try {
		const db = await openDB();
		if (!db) return false;
		return await new Promise((resolve) => {
			try {
				const tx = db.transaction(STORE_NAME, "readonly");
				const store = tx.objectStore(STORE_NAME);
				const req = store.get(key);
				req.onsuccess = () => {
					const record = req.result;
					resolve(record ? record.value : undefined);
				};
				req.onerror = () => {
					console.log(`error loading data with key ${key}, error keys ` + JSON.stringify(Object.keys(req.error || {})));
					resolve(false);
				};
			} catch (e) {
				console.log(`error loading data with key ${key}: `, e);
				resolve(false);
			}
		});
	} catch (e) {
		console.log(`error opening DB for load with key ${key}: `, e);
	}
	return false;
};

export const removeStorageData = async (key) => {
	try {
		const db = await openDB();
		if (!db) return false;
		return await new Promise((resolve) => {
			try {
				const tx = db.transaction(STORE_NAME, "readwrite");
				const store = tx.objectStore(STORE_NAME);
				const req = store.delete(key);
				req.onsuccess = () => resolve(true);
				req.onerror = () => {
					console.log(`error removing data with key ${key}, error keys ` + JSON.stringify(Object.keys(req.error || {})));
					resolve(false);
				};
			} catch (e) {
				console.log(`error removing data with key ${key}: `, e);
				resolve(false);
			}
		});
	} catch (e) {
		console.log(`error opening DB for remove with key ${key}: `, e);
	}
	return false;
};

