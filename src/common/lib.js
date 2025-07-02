//https://www.color-hex.com/color-palettes/

export const lightDarkBgColors = {
  schemeBgDark: {
    antiTxtBg: "#121212",
    bgAccent1: "#47448b",
    bgAccent2: "#5458b9",
    bgAccent3: "#6d8ff5",
    disabled: "#565656",
  },
  schemeBgLight: {
    antiTxtBg: "#dedede",
    bgAccent1: "#a187e1",
    bgAccent2: "#c5a2f2",
    bgAccent3: "#d5c5e3",
    disabled: "#787878",
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
    baseBg: { backgroundColor: "#121212" },
    bgPrimary: {
      backgroundColor: "#47448b",
    },
    bgAntiPrimary: {
      // equivalent to light primary
      backgroundColor: "#a187e1",
    },
    disabled: {
      backgroundColor: lightDarkBgColors.schemeBgDark.disabled,
    },
    cardQ: {
      backgroundColor: "#3a306d",
    },
    cardA: {
      backgroundColor: "#3a306d",
    },
    bgAccent1: {
      backgroundColor: lightDarkBgColors.schemeBgDark.bgAccent1,
    },
    bgAccent2: {
      backgroundColor: lightDarkBgColors.schemeBgDark.bgAccent2,
    },
    bgAccent3: {
      backgroundColor: lightDarkBgColors.schemeBgDark.bgAccent3,
    },
    border: {
      borderColor: "dedede",
      borderWidth: 1,
    },
    txt: {
      fontSize: 16,
      color: "#dedede",
    },
    antiTxtBg: {
      backgroundColor: lightDarkBgColors.schemeBgDark.antiTxtBg,
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
    baseBg: { backgroundColor: "#dedede" },
    bgPrimary: {
      backgroundColor: "#a187e1",
    },
    bgAntiPrimary: {
      // equivalent to dark primary
      backgroundColor: "#3a306d",
    },
    disabled: {
      backgroundColor: lightDarkBgColors.schemeBgLight.disabled,
    },
    cardQ: {
      backgroundColor: "#d5c5e3",
    },
    cardA: {
      backgroundColor: "#d5c5e3",
    },
    bgAccent1: {
      backgroundColor: lightDarkBgColors.schemeBgLight.bgAccent1,
    },
    bgAccent2: {
      backgroundColor: lightDarkBgColors.schemeBgLight.bgAccent2,
    },
    bgAccent3: {
      backgroundColor: lightDarkBgColors.schemeBgLight.bgAccent3,
    },
    border: {
      borderColor: "#121212",
      borderWidth: 1,
    },
    txt: {
      fontSize: 16,
      color: "#121212",
    },
    antiTxtBg: {
      backgroundColor: lightDarkBgColors.schemeBgLight.antiTxtBg,
    },
  },
};
