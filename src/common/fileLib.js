import { DECK_DATA_KEY, DECK_QA_KEY } from "./constants";
import { getRandomInt } from "./util";

export const loadDemoData = () => {
  try {
    const hasDeckData = checkIfExists(DECK_DATA_KEY);
    const hasQaDecks = checkIfExists(DECK_QA_KEY, true);
    // console.log("demo checks: " + JSON.stringify({ hasDeckData, hasQaDecks }));
    if (!hasDeckData && !hasQaDecks) {
      const demoDeckData = require("../../assets/demodeck.json");

      const deckListData = [];
      const numDecks = 1; // change number to test multiple decks
      for (let i = 0; i < numDecks; i++) {
        let id = getRandomInt(100000, 999999);
        deckListData.push({ ...demoDeckData.demoDeckData, id });
        saveDeckData(id, { ...demoDeckData.demoDeckQuestionData, id });
      }

      saveDeckListData(deckListData);
      return true;
    }
  } catch (e) {
    console.log("Error retrieving keys from localStorage:", e);
  }
  return false;
};

/**
 * Check if key exists in storage
 *
 * @param {string} key
 * @param {boolean} startsWith - if true, checks all keys to see if "key" exists as start of key
 * @returns boolean
 */
export const checkIfExists = (key, startsWith = false) => {
  try {
    const keys = Object.keys(localStorage);
    if (startsWith) {
      return keys.filter((thisKey) => thisKey.indexOf(key) === 0).length > 0;
    }
    // console.log("check key " + key);
    // console.log("result " + JSON.stringify(keys.indexOf(key) > -1));
    return keys.indexOf(key) > -1;
  } catch (e) {
    console.log("Error retrieving keys from localStorage:", e);
  }
  return false;
};

export const setFlag = (key, value) => {
  if (typeof key !== "string") {
    console.log("non-string key in setflag: '" + key + "'");
    return false;
  }
  saveStorageData(key, value);
};

export const getFlag = (key) => {
  const value = loadStorageData(key);
  return value;
};

// @todo change so this is NOT exported
export const loadAllDecks = () => {
  return loadStorageData(DECK_DATA_KEY);
};

export const getExportData = () => {
  let data = [];
  const allDecks = loadAllDecks();

  const deckData = allDecks.map((deck) => {
    const [selectedDeck, selectedDeckData] = loadDeckData(deck.id);
    return { ...selectedDeckData, deck: deck };
  });

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

const loadStorageData = (key) => {
  if (typeof key !== "string") {
    console.log("non-string key in loadStorageData");
    return false;
  }
  try {
    const value = localStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.log(`error loading data with key ${key}, error keys ` + JSON.stringify(Object.keys(e)));
  }
};

export const loadDeckFromStorage = (deckId) => {
  try {
    const deckListJson = localStorage.getItem(DECK_DATA_KEY);
    if (deckListJson !== null) {
      const deckListData = JSON.parse(deckListJson);
      const deck = deckListData.filter((deck) => deck.id == deckId);
      return deck.length > 0 ? deck[0] : [];
    }
  } catch (e) {
    console.log(`error loading data with key ${key}, error keys ` + JSON.stringify(Object.keys(e)));
  }
};

export const loadDeckData = (deckId) => {
  if (deckId) {
    const selectedDeck = loadDeckFromStorage(deckId);
    const selectedDeckData = loadQuestionsFromStorage(deckId);
    if (selectedDeck && Array.isArray(selectedDeckData?.questions) && selectedDeckData.questions.length) {
      return [selectedDeck, selectedDeckData];
    }
  }

  return [null, []];
};

export const loadQuestionsFromStorage = (deckId) => {
  return loadStorageData(DECK_QA_KEY + `_${deckId}`);
};

// DO NOT EXPORT
const saveStorageData = (key, value) => {
  if (typeof key !== "string") {
    console.log("non-string key in saveStorageData: '" + key + "'");
    return false;
  }
  try {
    // console.log("saving with key " + key + " value " + JSON.stringify(value));
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.log(`error saving data with key ${key}, error keys ` + JSON.stringify(Object.keys(error)));
  }
};

export const saveDeckListData = (deckListData) => {
  try {
    saveStorageData(DECK_DATA_KEY, deckListData);
    return true;
  } catch (error) {
    console.log(`error saving data with key ${key}, error keys ` + JSON.stringify(Object.keys(error)));
  }
  return false;
};

export const saveDeckData = (deckId, deckData) => {
  try {
    saveStorageData(DECK_QA_KEY + `_${deckId}`, deckData);
    return true;
  } catch (error) {
    console.log(`error saving data with key ${key}, error keys ` + JSON.stringify(Object.keys(error)));
  }
  return false;
};

export const updateDeckQuestionData = (deckId, questions) => {
  try {
    const deckData = loadStorageData(DECK_QA_KEY + `_${deckId}`);
    if (deckData) {
      saveStorageData(DECK_QA_KEY + `_${deckId}`, { ...deckData, questions });
    }
    return true;
  } catch (error) {
    console.log(`error saving data with key ${key}, error keys ` + JSON.stringify(Object.keys(error)));
  }
  return false;
};

export const removeStorageData = (key) => {
  if (typeof key !== "string") {
    console.log("non-string key in removeStorageData");
    return false;
  }
  try {
    const value = localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.log(`error loading data with key ${key}, error keys ` + JSON.stringify(Object.keys(e)));
  }
};
