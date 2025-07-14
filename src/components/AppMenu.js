import { Platform, Pressable, StyleSheet, View } from "react-native";

import { THEMES } from "../common/constants";
import { getScheme } from "../common/util";
import { StyledSwitch } from "./Deck/StyledSwitch";
import { useTheme } from "./Providers/ThemeProvider";
import { useLocale } from "./Providers/TranslationProvider";

const AppMenu = () => {
  const { getLocalString } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const scheme = getScheme(theme);
  return (
    <>
      <Pressable onPress={toggleTheme}>
        <View style={[styles.menuItem, { borderColor: scheme.txt.color }]}>
          <StyledSwitch
            theme={theme}
            txtStyle={[scheme.txt, { fontWeight: "bold", paddingRight: 5 }]}
            optionValue={theme === THEMES.dark} // set theme value to THEMES.dark
            onValueChange={toggleTheme}
            labelTxt={getLocalString("Dark Theme")}
            onClick={toggleTheme}
          />
        </View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    padding: 10,
    fontSize: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 15 : 10,
  },
});

export default AppMenu;
