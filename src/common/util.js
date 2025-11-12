import { useSafeAreaInsets } from "react-native-safe-area-context";
import sanitizeHtml from "sanitize-html";

import { MAX_CHAR_LIMIT, MAX_CHAR_LIMIT_L, MAX_CHAR_LIMIT_XL, MAX_CHAR_LIMIT_XXL, THEMES } from "./constants";
import { lightDarkStyles } from "./lib";

export const getRandomInt = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const delay = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getFontSize = (length) => {
  if (length <= MAX_CHAR_LIMIT_XXL) {
    return "xxl";
  }
  if (length <= MAX_CHAR_LIMIT_XL) {
    return "xl";
  }
  if (length <= MAX_CHAR_LIMIT_L) {
    return "l";
  }
  return "";
};

export const formatCardText = (text, lineLimitOverride = null) => {
  text = text.trim();
  if (text.length === 0) {
    return "";
  }
  const maxLimit = MAX_CHAR_LIMIT;
  if (text.length > maxLimit) {
    text = text.slice(0, maxLimit) + "...";
  }

  const charLimit = lineLimitOverride || 1000;
  let textPieces = [];
  let failsafe = 0;

  do {
    if (text.length > charLimit) {
      // get charLimit chars
      let thisPiece = text.substring(0, charLimit);

      // get last break
      let lastSpace = thisPiece.lastIndexOf(" ");
      let lastDash = thisPiece.lastIndexOf("-");
      let lastPos = lastSpace > lastDash ? lastSpace : lastDash;

      // store up to last break or all 20 chars
      if (lastPos > -1 && lastPos <= charLimit - 1) {
        // keep dash
        let substringEnd = lastPos === lastDash ? lastPos + 1 : lastPos;
        textPieces.push(thisPiece.substring(0, substringEnd));
        text = text.substring(substringEnd);
      } else {
        textPieces.push(thisPiece);
        text = text.substring(charLimit);
      }
    } else {
      textPieces.push(text);
      text = "";
    }
    text = text.trim();

    failsafe++;
  } while (text.length > 0 && failsafe < 30);

  return textPieces.join("\n");
};

export const sanitizeAll = (dirty) => {
  return sanitizeHtml(dirty, { allowedTags: [], allowedAttributes: {} });
};

export const getScheme = (theme) => {
  return theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;
};

const styles = {
  ...lightDarkStyles,
};

export const getInsetPadding = () => {
  const insets = useSafeAreaInsets();
  if (insets && insets.top) {
    return {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left ? insets.left : 5,
      paddingRight: insets.right ? insets.right : 5,
    };
  }
  return {};
};
