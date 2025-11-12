import { Dimensions } from "react-native";

export const DECK_DATA_KEY = "DECK_DATA";
export const DECK_QA_KEY = "DECK_QA";
export const THEME_KEY = "THEME";
export const RELOAD_LIST = "RELOAD_LIST";

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

// @todo use later
export const FONT_SIZES = {
  ios: {},
  android: {},
};

export const MIME_TYPE_CSV = ["text/csv", "text/comma-separated-values"];
export const MIME_TYPE_TEXT = ["text/plain"];

const { width } = Dimensions.get("window");
export const SAFE_MARGIN = Math.round(width / 20); // 5% width
// export const SAFE_WIDTH = width - Math.round(width / 20); // 95% width
// @todo TESTING WIDTH
export const SAFE_WIDTH = width; // 95% width
