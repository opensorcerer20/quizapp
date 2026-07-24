import { Dimensions } from "react-native";

export const DECK_DATA_KEY = "DECK_DATA";
export const DECK_QA_KEY = "DECK_QA";
export const THEME_KEY = "THEME";
export const RELOAD_LIST = "RELOAD_LIST";

// set once the one-time localStorage -> IndexedDB copy has completed
export const STORAGE_MIGRATED_KEY = "STORAGE_MIGRATED";

export const DB_NAME = "flashcardlibrary";
export const DB_VERSION = 1;
export const DB_STORE = "kv";

export const NEW_QUESTION_ADDED = "NEW_QUESTION_ADDED";

export const MAX_DECKS = 20;
export const MAX_QUESTIONS = 50;

export const MAX_CHAR_LIMIT_XXL = 20;
export const MAX_CHAR_LIMIT_XL = 80;
export const MAX_CHAR_LIMIT_L = 160;
export const MAX_CHAR_LIMIT = 240;

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

/*
393 × 852 px for your medium phone size and
440 × 956 px for your large phone size.
*/
const MIN_WIDTH = 440;
const MIN_HEIGHT = 956;
export const SCREEN_WIDTH = Math.min(MIN_WIDTH, Dimensions.get("window").width);
export const SCREEN_HEIGHT = Math.min(MIN_HEIGHT, Dimensions.get("window").height);
export const IS_MOBILE = SCREEN_HEIGHT < MIN_HEIGHT || SCREEN_WIDTH < MIN_WIDTH;
export const SAFE_MARGIN = Math.round(SCREEN_WIDTH / 20); // 5% width
export const SAFE_WIDTH = SCREEN_WIDTH * 0.9;

// source: https://gist.github.com/aminnj/5ca372aa2def72fb017b531c894afdca
const charWidths = {
  " ": 4.4453125,
  "!": 4.4453125,
  '"': 5.6796875,
  "#": 8.8984375,
  $: 8.8984375,
  "%": 14.2265625,
  "&": 10.671875,
  "'": 3.0546875,
  "(": 5.328125,
  ")": 5.328125,
  "*": 6.2265625,
  "+": 9.34375,
  ",": 4.4453125,
  "-": 5.328125,
  ".": 4.4453125,
  "/": 4.4453125,
  0: 8.8984375,
  1: 7.7228125,
  2: 8.8984375,
  3: 8.8984375,
  4: 8.8984375,
  5: 8.8984375,
  6: 8.8984375,
  7: 8.8984375,
  8: 8.8984375,
  9: 8.8984375,
  ":": 4.4453125,
  ";": 4.4453125,
  "<": 9.34375,
  "=": 9.34375,
  ">": 9.34375,
  "?": 8.8984375,
  "@": 16.2421875,
  A: 10.671875,
  B: 10.671875,
  C: 11.5546875,
  D: 11.5546875,
  E: 10.671875,
  F: 9.7734375,
  G: 12.4453125,
  H: 11.5546875,
  I: 4.4453125,
  J: 8,
  K: 10.671875,
  L: 8.8984375,
  M: 13.328125,
  N: 11.5546875,
  O: 12.4453125,
  P: 10.671875,
  Q: 12.4453125,
  R: 11.5546875,
  S: 10.671875,
  T: 9.7734375,
  U: 11.5546875,
  V: 10.671875,
  W: 15.1015625,
  X: 10.671875,
  Y: 10.671875,
  Z: 9.7734375,
  "[": 4.4453125,
  "\\": 4.4453125,
  "]": 4.4453125,
  "^": 7.5078125,
  _: 8.8984375,
  "`": 5.328125,
  a: 8.8984375,
  b: 8.8984375,
  c: 8,
  d: 8.8984375,
  e: 8.8984375,
  f: 4.15921875,
  g: 8.8984375,
  h: 8.8984375,
  i: 3.5546875,
  j: 3.5546875,
  k: 8,
  l: 3.5546875,
  m: 13.328125,
  n: 8.8984375,
  o: 8.8984375,
  p: 8.8984375,
  q: 8.8984375,
  r: 5.328125,
  s: 8,
  t: 4.4453125,
  u: 8.8984375,
  v: 8,
  w: 11.5546875,
  x: 8,
  y: 8,
  z: 8,
  "{": 5.34375,
  "|": 4.15625,
  "}": 5.34375,
  "~": 9.34375,
};

// Default width for characters not in the charWidths map
const DEFAULT_CHAR_WIDTH =
  Object.keys(charWidths).length > 0
    ? Object.values(charWidths).reduce((a, c) => a + c, 0) / Object.keys(charWidths).length
    : 0;

export const getStrWidth = (str) => {
  if (typeof str !== "string") throw new Error("Invalid string for getStrWidth");
  return str.split("").reduce((acc, currVal) => {
    return acc + (charWidths[currVal] ?? DEFAULT_CHAR_WIDTH);
  }, 0);
};

// arbitrary default width of 360 for mobile phone
export const clipWideString = (str, maxPixelLength = 360) => {
  if (typeof str !== "string") throw new Error("Invalid string for clipWideString");
  if (str.length < 11) return str;

  let totalWidth = 0;
  let clippedIndex = 0;

  for (let i = 0; i < str.length; i++) {
    const charWidth = charWidths[str[i]] ?? DEFAULT_CHAR_WIDTH;
    if (totalWidth + charWidth > maxPixelLength) {
      break;
    }
    totalWidth += charWidth;
    clippedIndex = i + 1;
  }

  return str.slice(0, clippedIndex);
};
