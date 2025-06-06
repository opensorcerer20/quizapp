import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  DECK_DATA_KEY,
  DECK_QA_KEY,
} from "./constants";

export const loadStorageData = async (key) => {
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

export const removeStorageData = async (key) => {
  try {
    const value = await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.log(`error loading data with key ${key}, error keys ` + JSON.stringify(Object.keys(e)));
  }
};
