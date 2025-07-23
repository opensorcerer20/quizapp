import AsyncStorage from "@react-native-async-storage/async-storage";

import { DECK_DATA_KEY, DECK_QA_KEY } from "./constants";
import { getRandomInt } from "./util";

export const loadDemoData = async () => {
  try {
    const hasDeckData = await checkIfExists(DECK_DATA_KEY);
    const hasQaDecks = await checkIfExists(DECK_QA_KEY, true);
    // console.log("demo checks: " + JSON.stringify({ hasDeckData, hasQaDecks }));
    if (!hasDeckData && !hasQaDecks) {
      const demoDeckData = require("../../assets/demodeck.json");
      const deckId = getRandomInt(100000, 999999);
      await saveDeckListData([{ ...demoDeckData.demoDeckData, id: deckId }]);
      await saveDeckData(deckId, { ...demoDeckData.demoDeckQuestionData, id: deckId });
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
  await saveStorageData(key, value);
};

export const getFlag = async (key) => {
  await loadStorageData(key);
};

// @todo change so this is NOT exported
export const loadAllDecks = async () => {
  return await loadStorageData(DECK_DATA_KEY);
};

const loadStorageData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.log(`error loading data with key ${key}, error keys ` + JSON.stringify(Object.keys(e)));
  }
};

export const loadDeckFromStorage = async (deckId) => {
  try {
    const deckListJson = await AsyncStorage.getItem(DECK_DATA_KEY);
    if (deckListJson !== null) {
      const deckListData = JSON.parse(deckListJson);
      const deck = deckListData.filter((deck) => deck.id == deckId);
      return deck.length > 0 ? deck[0] : [];
    }
  } catch (e) {
    console.log(`error loading data with key ${key}, error keys ` + JSON.stringify(Object.keys(e)));
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
  return await loadStorageData(DECK_QA_KEY + `_${deckId}`);
};

// DO NOT EXPORT
const saveStorageData = async (key, value) => {
  try {
    // console.log("saving with key " + key + " value " + JSON.stringify(value));
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.log(`error saving data with key ${key}, error keys ` + JSON.stringify(Object.keys(error)));
  }
};

export const saveDeckListData = async (deckListData) => {
  try {
    await saveStorageData(DECK_DATA_KEY, deckListData);
    return true;
  } catch (error) {
    console.log(`error saving data with key ${key}, error keys ` + JSON.stringify(Object.keys(error)));
  }
  return false;
};

export const saveDeckData = async (deckId, deckData) => {
  try {
    await saveStorageData(DECK_QA_KEY + `_${deckId}`, deckData);
    return true;
  } catch (error) {
    console.log(`error saving data with key ${key}, error keys ` + JSON.stringify(Object.keys(error)));
  }
  return false;
};

export const updateDeckQuestionData = async (deckId, questions) => {
  try {
    const deckData = await loadStorageData(DECK_QA_KEY + `_${deckId}`);
    if (deckData) {
      await saveStorageData(DECK_QA_KEY + `_${deckId}`, { ...deckData, questions });
    }
  } catch (error) {
    console.log(`error saving data with key ${key}, error keys ` + JSON.stringify(Object.keys(error)));
  }
};

export const removeStorageData = async (key) => {
  try {
    const value = await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.log(`error loading data with key ${key}, error keys ` + JSON.stringify(Object.keys(e)));
  }
};
