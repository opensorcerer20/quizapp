//https://www.color-hex.com/color-palettes/

import { Platform } from "react-native";

import { SAFE_WIDTH } from "./constants";

/*
accent #8B5DFF
secondary #6A42C2
primary #563A9C
dark #121212
light #f2f2f7
*/
const lightDarkBgColors = {
  schemeBgDark: {
    accent: "#8B5DFF",
    secondary: "#6A42C2",
    primary: "#563A9C",
    bg: "#000000",
    modalBg: "#232323",
    txt: "#dedede",
    disabled: "#787878",
    disabled2: "#a9a9a9",
    bgAccent3: "#4a63ac",
    buttonBg: "#6443b6",
    buttonTxt: "#dedede",
  },
  schemeBgLight: {
    accent: "#E2D2F1",
    secondary: "#D0BBE3",
    primary: "#C4A2E3",
    txt: "#000000",
    bg: "#efefef",
    modalBg: "#efefef",
    disabled: "#787878",
    disabled2: "#a9a9a9",
    bgAccent3: "#d5c5e3",
    buttonBg: "#90589C",
    buttonTxt: "#dedede",
  },
};

export const lightDarkStyles = {
  schemeDark: {
    bgAccent: { backgroundColor: lightDarkBgColors.schemeBgDark.accent },
    bgSecondary: { backgroundColor: lightDarkBgColors.schemeBgDark.secondary },
    bgPrimary: { backgroundColor: lightDarkBgColors.schemeBgDark.primary },
    bg: { backgroundColor: lightDarkBgColors.schemeBgDark.bg },
    modalBg: { backgroundColor: lightDarkBgColors.schemeBgDark.modalBg },
    txt: { fontSize: 16, color: lightDarkBgColors.schemeBgDark.txt },
    txtForBg: { fontSize: 16, color: lightDarkBgColors.schemeBgDark.txt },
    bgDisabled: { backgroundColor: lightDarkBgColors.schemeBgDark.disabled },
    bgDisabled2: { backgroundColor: lightDarkBgColors.schemeBgDark.disabled2 },
    txtDisabled: { fontSize: 16, color: lightDarkBgColors.schemeBgDark.disabled },
    border: {
      borderColor: lightDarkBgColors.schemeBgDark.accent,
      borderWidth: 1,
    },

    bgAccent3: {
      backgroundColor: lightDarkBgColors.schemeBgDark.bgAccent3,
    },
    buttonBg: {
      backgroundColor: lightDarkBgColors.schemeBgDark.buttonBg,
    },
    buttonTxt: {
      color: lightDarkBgColors.schemeBgDark.buttonTxt,
    },
  },
  schemeLight: {
    bgAccent: { backgroundColor: lightDarkBgColors.schemeBgLight.accent },
    bgSecondary: { backgroundColor: lightDarkBgColors.schemeBgLight.secondary },
    bgPrimary: { backgroundColor: lightDarkBgColors.schemeBgLight.primary },
    bg: { backgroundColor: lightDarkBgColors.schemeBgLight.bg },
    modalBg: { backgroundColor: lightDarkBgColors.schemeBgLight.modalBg },
    txt: { fontSize: 16, color: lightDarkBgColors.schemeBgLight.txt },
    txtForBg: { fontSize: 16, color: lightDarkBgColors.schemeBgLight.txt },
    bgDisabled: { backgroundColor: lightDarkBgColors.schemeBgLight.disabled },
    bgDisabled2: { backgroundColor: lightDarkBgColors.schemeBgLight.disabled },
    txtDisabled: { fontSize: 16, color: lightDarkBgColors.schemeBgLight.disabled },
    border: {
      borderColor: lightDarkBgColors.schemeBgLight.accent,
      borderWidth: 1,
    },

    bgAccent3: {
      backgroundColor: lightDarkBgColors.schemeBgLight.bgAccent3,
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
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  button2: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
    height: Platform.select({
      ios: 42,
      android: 40,
    }),
  },
  checkbox: {
    padding: 10,
    margin: 10,
  },
  bgWhite: {
    backgroundColor: lightDarkBgColors.schemeBgLight.bg,
  },
  bgBlack: {
    backgroundColor: lightDarkBgColors.schemeBgDark.bg,
  },
  txtWhite: {
    color: lightDarkBgColors.schemeBgDark.txt, // note that for white text, you need dark bg
  },
  txtBlack: {
    color: lightDarkBgColors.schemeBgLight.txt,
  },
};
