//https://www.color-hex.com/color-palettes/

export const lightDarkBgColors = {
  schemeBgDark: {
    baseBg: "#121212",
    antiBaseBg: "#efefef",
    antiTxtBg: "#121212",
    bgAccent1: "#47448b",
    bgAccent3: "#5c79cfff",
    buttonBg: "#68d0aa",
    buttonTxt: "#121212",
    disabled: "#565656",
    txt: "#efefef",
  },
  schemeBgLight: {
    baseBg: "#efefef",
    antiBaseBg: "#121212",
    antiTxtBg: "#efefef",
    bgAccent1: "#a187e1",
    bgAccent3: "#d5c5e3",
    buttonBg: "#2cc48c",
    buttonTxt: "#121212",
    disabled: "#787878",
    txt: "#121212",
  },
};

export const lightDarkStyles = {
  schemeDark: {
    /*
  #3a306d	(74,64,125)
  #47448b	(87,84,155)
  #5458b9	(100,104,185)
  #616cc7	(113,124,215)
  #6d8ff5	(125,143,245)
    */
    baseBg: { backgroundColor: lightDarkBgColors.schemeBgDark.baseBg },
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
      backgroundColor: "#383573",
    },
    cardA: {
      backgroundColor: "#564fcc",
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
    /*
  #8265aa	(114,85,154)
  #a187e1	(145,119,209)
  #c5a2f2	(197,162,242)
  #d5c5e3	(213,197,227)
  #f6f2fa	(246,242,250)
    */
    baseBg: { backgroundColor: lightDarkBgColors.schemeBgLight.baseBg },
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
      backgroundColor: "#ca9af5",
    },
    cardA: {
      backgroundColor: "#9e6bca",
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
