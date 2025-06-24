import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";

import { THEMES } from "../common/constants";
import { lightDarkStyles } from "../common/lib";
import { useTheme } from "./Providers/ThemeProvider";

const Toolbar = ({ title = null, showBack = true, themeSetting = THEMES.light, toggleTheme = () => {} }) => {
  let themeIcon = null;
  if (themeSetting) {
    themeIcon = themeSetting === THEMES.dark ? "moon-waning-crescent" : "weather-sunny";
  }

  const { theme } = useTheme();
  const scheme = theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;

  return (
    <Appbar.Header style={[scheme.bg3, scheme.txt]}>
      {showBack && <Appbar.BackAction color={scheme.txt.color} onPress={() => router.back()} />}
      <Appbar.Content title={title || "Flashcard Library"} color={scheme.txt.color} />
      {themeIcon && <Appbar.Action icon={themeIcon} onPress={toggleTheme} color={scheme.txt.color} />}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  ...lightDarkStyles,
});

export default Toolbar;
