import { DECK_DATA_KEY, DECK_QA_KEY } from "./constants";
import * as storage from "./storage";
import { getRandomInt } from "./util";

export const loadDemoData = async () => {
  try {
    const hasDeckData = await checkIfExists(DECK_DATA_KEY);
    const hasQaDecks = await checkIfExists(DECK_QA_KEY, true);
    // console.log("demo checks: " + JSON.stringify({ hasDeckData, hasQaDecks }));
    if (!hasDeckData && !hasQaDecks) {
      const demoDeckData = require("../../assets/demodeck.json");

      const deckListData = [];
      const numDecks = 1; // change number to test multiple decks
      for (let i = 0; i < numDecks; i++) {
        let id = getRandomInt(100000, 999999);
        deckListData.push({ ...demoDeckData.demoDeckData, id });
        await saveDeckData(id, { ...demoDeckData.demoDeckQuestionData, id });
      }

      await saveDeckListData(deckListData);
      return true;
    }
  } catch (e) {
    console.log("Error retrieving keys from storage:", e);
  }
  return false;
};

/**
 * Check if key exists in storage
 *
 * @param {string} key
 * @param {boolean} startsWith - if true, checks all keys to see if "key" exists as start of key
 * @returns Promise<boolean>
 */
export const checkIfExists = async (key, startsWith = false) => {
  try {
    return await storage.hasKey(key, startsWith);
  } catch (e) {
    console.log("Error retrieving keys from storage:", e);
  }
  return false;
};

export const setFlag = async (key, value) => {
  if (typeof key !== "string") {
    console.log("non-string key in setflag: '" + key + "'");
    return false;
  }
  return saveStorageData(key, value);
};

export const getFlag = async (key) => {
  const value = await loadStorageData(key);
  return value;
};

// @todo change so this is NOT exported
export const loadAllDecks = async () => {
  return loadStorageData(DECK_DATA_KEY);
};

export const getExportData = async () => {
  let data = [];
  const allDecks = await loadAllDecks();

  if (!Array.isArray(allDecks)) {
    return "";
  }

  const loadedDecks = await Promise.all(
    allDecks.map(async (deck) => {
      const [, selectedDeckData] = await loadDeckData(deck.id);
      return { ...selectedDeckData, deck: deck };
    })
  );

  // skip decks whose question data couldn't be loaded
  const deckData = loadedDecks.filter((deck) => Array.isArray(deck.questions));

  // sort decks with most recent first
  deckData.sort((a, b) => b.deck.createdAt - a.deck.createdAt);

  deckData.map((deck) => {
    data.push("===");
    data.push(`=== Deck name: ${deck.deck.name}`);
    deck.questions.map((questionObj) => {
      data.push(questionObj.q);
      data.push(questionObj.a);
    });
  });
  return data.join("\n");
};

const loadStorageData = async (key) => {
  if (typeof key !== "string") {
    console.log("non-string key in loadStorageData");
    return false;
  }
  try {
    return await storage.getItem(key);
  } catch (e) {
    console.log(`error loading data with key ${key}, error keys ` + JSON.stringify(Object.keys(e)));
  }
};

export const loadDeckFromStorage = async (deckId) => {
  try {
    const deckListData = await loadAllDecks();
    if (Array.isArray(deckListData)) {
      const deck = deckListData.filter((deck) => deck.id == deckId);
      return deck.length > 0 ? deck[0] : [];
    }
  } catch (e) {
    console.log(`error loading deck with id ${deckId}, error keys ` + JSON.stringify(Object.keys(e)));
  }
};

export const loadDeckData = async (deckId) => {
  if (deckId) {
    const [selectedDeck, selectedDeckData] = await Promise.all([
      loadDeckFromStorage(deckId),
      loadQuestionsFromStorage(deckId),
    ]);
    if (selectedDeck && Array.isArray(selectedDeckData?.questions) && selectedDeckData.questions.length) {
      return [selectedDeck, selectedDeckData];
    }
  }

  return [null, []];
};

export const loadQuestionsFromStorage = async (deckId) => {
  return loadStorageData(DECK_QA_KEY + `_${deckId}`);
};

// DO NOT EXPORT
const saveStorageData = async (key, value) => {
  if (typeof key !== "string") {
    console.log("non-string key in saveStorageData: '" + key + "'");
    return false;
  }
  try {
    // console.log("saving with key " + key + " value " + JSON.stringify(value));
    await storage.setItem(key, value);
    return true;
  } catch (error) {
    console.log(`error saving data with key ${key}, error keys ` + JSON.stringify(Object.keys(error)));
  }
  return false;
};

export const saveDeckListData = async (deckListData) => {
  return saveStorageData(DECK_DATA_KEY, deckListData);
};

export const saveDeckData = async (deckId, deckData) => {
  return saveStorageData(DECK_QA_KEY + `_${deckId}`, deckData);
};

export const updateDeckQuestionData = async (deckId, questions) => {
  try {
    const deckData = await loadStorageData(DECK_QA_KEY + `_${deckId}`);
    if (deckData) {
      return saveStorageData(DECK_QA_KEY + `_${deckId}`, { ...deckData, questions });
    }
  } catch (error) {
    console.log(`error saving questions for deck ${deckId}, error keys ` + JSON.stringify(Object.keys(error)));
  }
  return false;
};

export const removeStorageData = async (key) => {
  if (typeof key !== "string") {
    console.log("non-string key in removeStorageData");
    return false;
  }
  try {
    await storage.removeItem(key);
    return true;
  } catch (e) {
    console.log(`error removing data with key ${key}, error keys ` + JSON.stringify(Object.keys(e)));
  }
  return false;
};
