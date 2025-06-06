import { router } from "expo-router";
import { Appbar } from "react-native-paper";

import { THEMES } from "../common/constants";

const Toolbar = ({ title = null, showBack = true, theme = THEMES.light, toggleTheme = () => {} }) => {
  let themeIcon = null;
  if (theme) {
    themeIcon = theme === THEMES.dark ? "moon-waning-crescent" : "weather-sunny";
  }

  return (
    <Appbar.Header>
      {showBack && <Appbar.BackAction color={"#dddddd"} onPress={() => router.back()} />}
      <Appbar.Content title={title || "Flashcard Library"} />
      {themeIcon && <Appbar.Action icon={themeIcon} onPress={toggleTheme} />}
    </Appbar.Header>
  );
};

export default Toolbar;
