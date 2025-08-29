import { Dimensions } from "react-native";

export const DECK_DATA_KEY = "DECK_DATA";
export const DECK_QA_KEY = "DECK_QA";
export const THEME_KEY = "THEME";

export const NEW_DECK_ADDED = "NEW_DECK_ADDED";
export const NEW_QUESTION_ADDED = "NEW_QUESTION_ADDED";

export const MAX_DECKS = 20;
export const MAX_QUESTIONS = 50;

export const MAX_CHAR_LIMIT_XXL = 10;
export const MAX_CHAR_LIMIT_XL = 40;
export const MAX_CHAR_LIMIT_L = 80;
export const MAX_CHAR_LIMIT = 120;

export const VIEWS = {
  homeView: "homeView",
  quizView: "quizView",
};

export const THEMES = {
  light: "light",
  dark: "dark",
};

export const MIME_TYPE_CSV = ["text/csv", "text/comma-separated-values"];
export const MIME_TYPE_TEXT = ["text/plain"];

const { width } = Dimensions.get("window");
export const SAFE_MARGIN = Math.round(width / 20); // 5% width
export const SAFE_WIDTH = width - Math.round(width / 20); // 95% width

export const LANGUAGE_LIBRARY = {
  "Flashcard Library": {
    en: "Flashcard Library",
  },
  "Saved Decks": {
    en: "Saved Decks",
  },
  "No decks in memory": {
    en: "No decks in memory",
  },
  "please add a deck": {
    en: "please add a deck",
  },
  "No deck data": {
    en: "No deck data",
  },
  View: {
    en: "View",
  },
  Rename: {
    en: "Rename",
  },
  Delete: {
    en: "Delete",
  },
  Cancel: {
    en: "Cancel",
  },
  Confirm: {
    en: "Confirm",
  },
  Submit: {
    en: "Submit",
  },
  "Show All Cards": {
    en: "Show All Cards",
  },
  "Hide All Cards": {
    en: "Hide All Cards",
  },
  "Name this deck": {
    en: "Name this deck",
  },
  "Reverse question and answer": {
    en: "Reverse Q & A",
  },
  "Turn card off": {
    en: "Turn card off",
  },
  "Card [x] of [y]": {
    en: "Card [x] of [y]",
  },
  Question: {
    en: "Question",
  },
  Answer: {
    en: "Answer",
  },
  Text: {
    en: "Text",
  },
  "Dark Theme": {
    en: "Dark Theme",
  },
  "Are you sure you want to delete this deck?": {
    en: "Are you sure you want to delete this deck?",
  },
};
