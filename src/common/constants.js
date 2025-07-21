import { Dimensions } from "react-native";

export const DECK_DATA_KEY = "DECK_DATA";
export const DECK_QA_KEY = "DECK_QA";
export const THEME_KEY = "THEME";
export const TUTORIAL_SHOWN_KEY = "TUTORIAL_SHOWN";

export const MAX_DECKS = 20;
export const MAX_QUESTIONS = 50;

export const MAX_CHAR_LIMIT_XXL = 10;
export const MAX_CHAR_LIMIT_XL = 60;
export const MAX_CHAR_LIMIT_L = 90;
export const MAX_CHAR_LIMIT = 120;

export const LINE_CHAR_LIMIT = 40;
export const LINE_CHAR_LIMIT_L = 33;
export const LINE_CHAR_LIMIT_XL = 27;
export const LINE_CHAR_LIMIT_XXL = 10;

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

export const LIGHT_APP_BG = "pexels-asphotograpy-518245.jpg";
export const DARK_APP_BG = "pexels-gantas-3750272.jpg";

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
};
