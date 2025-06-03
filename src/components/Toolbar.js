import { useTheme } from "./Providers/ThemeProvider";
import { Appbar } from "react-native-paper";
import { THEMES, VIEWS } from "../common/constants";

const Toolbar = ({ title, currentView, backCallback }) => {
  const { theme, toggleTheme } = useTheme();
  let themeIcon = null;
  if (theme) {
    themeIcon = theme === THEMES.dark ? "moon-waning-crescent" : "weather-sunny";
  }

  const showBack = currentView === VIEWS.quizView;
  return (
    <Appbar.Header>
      {showBack && <Appbar.BackAction color={"#dddddd"} onPress={() => backCallback()} />}
      <Appbar.Content title={title || "Flashcard Library"} />
      {themeIcon && <Appbar.Action icon={themeIcon} onPress={toggleTheme} />}
    </Appbar.Header>
  );
};

export default Toolbar;
