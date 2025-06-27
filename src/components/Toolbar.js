import { router } from "expo-router";
import { Appbar } from "react-native-paper";

import { THEMES } from "../common/constants";
import { getScheme } from "../common/util";
import { useTheme } from "./Providers/ThemeProvider";

const Toolbar = ({ title = null, showBack = true, themeSetting = THEMES.light, toggleTheme = () => {} }) => {
  let themeIcon = null;
  if (themeSetting) {
    themeIcon = themeSetting === THEMES.dark ? "moon-waning-crescent" : "weather-sunny";
  }

  const { theme } = useTheme();
  const scheme = getScheme(theme);

  return (
    <Appbar.Header style={[scheme.bgAccent1, scheme.txt]}>
      {showBack && <Appbar.BackAction color={scheme.txt.color} onPress={() => router.back()} />}
      <Appbar.Content title={title || "Flashcard Library"} color={scheme.txt.color} />
      {themeIcon && <Appbar.Action icon={themeIcon} onPress={toggleTheme} color={scheme.txt.color} />}
    </Appbar.Header>
  );
};

export default Toolbar;
