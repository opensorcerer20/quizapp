//https://www.color-hex.com/color-palettes/

import { Platform } from "react-native";
import { SAFE_WIDTH } from "./constants";

export const lightDarkBgColors = {
  schemeBgDark: {
    baseBg: "#121212",
    baseBg2: "#232323",
    baseBg3: "#343434",
    antiBaseBg: "#efefef",
    antiTxtBg: "#121212",
    bgAccent1: "#343434",
    bgAccent3: "#4a63ac",
    cardQ: "#4a63ac",
    cardA: "#4a63ac",
    buttonBg: "#3650A1",
    buttonTxt: "#efefef",
    disabled: "#787878",
    txt: "#efefef",
  },
  schemeBgLight: {
    baseBg: "#ffffff",
    baseBg2: "#ffffff",
    baseBg3: "#ffffff",
    antiBaseBg: "#121212",
    antiTxtBg: "#ffffff",
    bgAccent1: "#ffffff",
    bgAccent3: "#d5c5e3",
    cardQ: "#d5c5e3",
    cardA: "#d5c5e3",
    buttonBg: "#90589C",
    buttonTxt: "#efefef",
    disabled: "#787878",
    txt: "#121212",
  },
};

export const lightDarkStyles = {
  schemeDark: {
    baseBg: { backgroundColor: lightDarkBgColors.schemeBgDark.baseBg },
    baseBg2: { backgroundColor: lightDarkBgColors.schemeBgDark.baseBg2 },
    baseBg3: { backgroundColor: lightDarkBgColors.schemeBgDark.baseBg3 },
    bgPrimary: {
      backgroundColor: lightDarkBgColors.schemeBgDark.bgAccent1,
    },
    bgAntiPrimary: {
      // equivalent to light primary
      backgroundColor: lightDarkBgColors.schemeBgLight.bgAccent1,
    },
    disabled: {
      backgroundColor: lightDarkBgColors.schemeBgDark.disabled,
    },
    cardQ: {
      backgroundColor: lightDarkBgColors.schemeBgDark.cardQ,
    },
    cardA: {
      backgroundColor: lightDarkBgColors.schemeBgDark.cardA,
    },
    bgAccent1: {
      backgroundColor: lightDarkBgColors.schemeBgDark.bgAccent1,
    },
    bgAccent3: {
      backgroundColor: lightDarkBgColors.schemeBgDark.bgAccent3,
    },
    border: {
      borderColor: lightDarkBgColors.schemeBgDark.antiBaseBg,
      borderWidth: 1,
    },
    txt: {
      fontSize: 16,
      color: lightDarkBgColors.schemeBgDark.txt,
    },
    antiTxtBg: {
      backgroundColor: lightDarkBgColors.schemeBgDark.antiTxtBg,
    },
    buttonBg: {
      backgroundColor: lightDarkBgColors.schemeBgDark.buttonBg,
    },
    buttonTxt: {
      color: lightDarkBgColors.schemeBgDark.buttonTxt,
    },
  },
  schemeLight: {
    baseBg: { backgroundColor: lightDarkBgColors.schemeBgLight.baseBg },
    baseBg2: { backgroundColor: lightDarkBgColors.schemeBgLight.baseBg2 },
    baseBg3: { backgroundColor: lightDarkBgColors.schemeBgLight.baseBg3 },
    bgPrimary: {
      backgroundColor: lightDarkBgColors.schemeBgLight.bgAccent1,
    },
    bgAntiPrimary: {
      // equivalent to dark primary
      backgroundColor: lightDarkBgColors.schemeBgDark.bgAccent1,
    },
    disabled: {
      backgroundColor: lightDarkBgColors.schemeBgLight.disabled,
    },
    cardQ: {
      backgroundColor: lightDarkBgColors.schemeBgLight.cardQ,
    },
    cardA: {
      backgroundColor: lightDarkBgColors.schemeBgLight.cardA,
    },
    bgAccent1: {
      backgroundColor: lightDarkBgColors.schemeBgLight.bgAccent1,
    },
    bgAccent3: {
      backgroundColor: lightDarkBgColors.schemeBgLight.bgAccent3,
    },
    border: {
      borderColor: lightDarkBgColors.schemeBgLight.antiBaseBg,
      borderWidth: 1,
    },
    txt: {
      fontSize: 16,
      color: lightDarkBgColors.schemeBgLight.txt,
    },
    antiTxtBg: {
      backgroundColor: lightDarkBgColors.schemeBgLight.antiTxtBg,
    },
    buttonBg: {
      backgroundColor: lightDarkBgColors.schemeBgLight.buttonBg,
    },
    buttonTxt: {
      color: lightDarkBgColors.schemeBgLight.buttonTxt,
    },
  },
};

export const globalStyles = {
  textField: {
    width: SAFE_WIDTH * 0.9,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 18,
    backgroundColor: "#fafafa",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
    height: Platform.select({
      ios: 30,
      android: 40,
    }),
  },
  checkbox: {
    padding: 10,
    margin: 10,
  },
};
