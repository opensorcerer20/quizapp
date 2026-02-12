import AsyncStorage from "@react-native-async-storage/async-storage";

import * as asyncFileLib from "./asyncFileLib";
import { DECK_DATA_KEY, DECK_QA_KEY } from "./constants";
import { getRandomInt } from "./util";
import * as webFileLib from "./webFileLib";

const TEST_USE_ASYNC_FLAG = false;
const storageFileLib = TEST_USE_ASYNC_FLAG ? asyncFileLib : webFileLib;

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
    console.log("Error retrieving keys from AsyncStorage:", e);
  }
  return false;
};

/**
 * Check if key exists in async storage
 *
 * @param {string} key
 * @param {boolean} startsWith - if true, checks all keys to see if "key" exists as start of key
 * @returns boolean
 */
export const checkIfExists = async (key, startsWith = false) => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    if (startsWith) {
      return keys.filter((thisKey) => thisKey.indexOf(key) === 0).length > 0;
    }
    // console.log("check key " + key);
    // console.log("result " + JSON.stringify(keys.indexOf(key) > -1));
    return keys.indexOf(key) > -1;
  } catch (e) {
    console.log("Error retrieving keys from AsyncStorage:", e);
  }
  return false;
};

export const setFlag = async (key, value) => {
  await storageFileLib.saveStorageData(key, value);
};

export const getFlag = async (key) => {
  const value = await storageFileLib.loadStorageData(key);
  return value;
};

// @todo change so this is NOT exported
export const loadAllDecks = async () => {
  return await storageFileLib.loadStorageData(DECK_DATA_KEY);
};

export const getExportData = async () => {
  let data = [];
  const allDecks = await loadAllDecks();

  const deckData = await Promise.all(
    allDecks.map(async (deck) => {
      const [selectedDeck, selectedDeckData] = await loadDeckData(deck.id);
      return { ...selectedDeckData, deck: deck };
    })
  );

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

export const loadDeckFromStorage = async (deckId) => {
  try {
    const deckListJson = await storageFileLib.loadStorageData(DECK_DATA_KEY);
    if (deckListJson !== null) {
      const deck = deckListJson.filter((deck) => deck.id == deckId);
      return deck.length > 0 ? deck[0] : [];
    }
  } catch (e) {
    console.log(`error loading data with key ${deckId}, error keys ` + JSON.stringify(Object.keys(e)));
  }
};

export const loadDeckData = async (deckId) => {
  if (deckId) {
    const selectedDeck = await loadDeckFromStorage(deckId);
    const selectedDeckData = await loadQuestionsFromStorage(deckId);
    if (selectedDeck && Array.isArray(selectedDeckData?.questions) && selectedDeckData.questions.length) {
      return [selectedDeck, selectedDeckData];
    }
  }

  return [null, []];
};

export const loadQuestionsFromStorage = async (deckId) => {
  return await storageFileLib.loadStorageData(DECK_QA_KEY + `_${deckId}`);
};

export const saveDeckListData = async (deckListData) => {
  try {
    await storageFileLib.saveStorageData(DECK_DATA_KEY, deckListData);
    return true;
  } catch (error) {
    console.log(`error saving data with key ${key}, error keys ` + JSON.stringify(Object.keys(error)));
  }
  return false;
};

export const saveDeckData = async (deckId, deckData) => {
  try {
    await storageFileLib.saveStorageData(DECK_QA_KEY + `_${deckId}`, deckData);
    return true;
  } catch (error) {
    console.log(`error saving data with key ${key}, error keys ` + JSON.stringify(Object.keys(error)));
  }
  return false;
};

export const updateDeckQuestionData = async (deckId, questions) => {
  try {
    const deckData = await storageFileLib.loadStorageData(DECK_QA_KEY + `_${deckId}`);
    if (deckData) {
      await storageFileLib.saveStorageData(DECK_QA_KEY + `_${deckId}`, { ...deckData, questions });
    }
    return true;
  } catch (error) {
    console.log(`error saving data with key ${key}, error keys ` + JSON.stringify(Object.keys(error)));
  }
  return false;
};

export const removeStorageData = async (key) => {
  return storageFileLib.removeStorageData(key);
};
