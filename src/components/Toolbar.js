import { useState } from "react";

import { router } from "expo-router";
import { Appbar } from "react-native-paper";

import { THEMES } from "../common/constants";
import { getScheme } from "../common/util";
import HelpMenu from "./HelpMenu";
import { useTheme } from "./Providers/ThemeProvider";
import { useLocale } from "./Providers/TranslationProvider";

const Toolbar = ({ title = null, showBack = true, themeSetting = THEMES.light, toggleTheme = () => {} }) => {
  const { getLocalString } = useLocale();
  const [showHelp, setShowHelp] = useState(false);

  let themeIcon = null;
  if (themeSetting) {
    themeIcon = themeSetting === THEMES.dark ? "moon-waning-crescent" : "weather-sunny";
  }

  const { theme } = useTheme();
  const scheme = getScheme(theme);

  return (
    <>
      <Appbar.Header style={[scheme.antiTxtBg, scheme.txt]}>
        {showBack && <Appbar.BackAction color={scheme.txt.color} onPress={() => router.back()} />}
        <Appbar.Content
          title={title === null ? getLocalString("Flashcard Library") : title}
          color={scheme.txt.color}
          style={{}}
        />
        {themeIcon && <Appbar.Action icon={themeIcon} onPress={toggleTheme} color={scheme.txt.color} />}
        <Appbar.Action icon={"help"} onPress={() => setShowHelp(!showHelp)} color={scheme.txt.color} />
        {/* <Appbar.Action color={scheme.txt.color} icon="dots-vertical" onPress={onMenuClick} /> */}
      </Appbar.Header>
      {showHelp && <HelpMenu helpType={showBack ? "deck" : "list"} showHelp={showHelp} setShowHelp={setShowHelp} />}
    </>
  );
};

export default Toolbar;
