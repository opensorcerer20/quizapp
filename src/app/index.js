import { StatusBar } from "expo-status-bar";

import { useTheme } from "../components/Providers/ThemeProvider";
import ScreenTemplate from "../components/ScreenTemplate";
import Toolbar from "../components/Toolbar";
import { DeckList } from "./DeckList";

export default QuizApp = () => {
  const { theme, toggleTheme } = useTheme();

  // use to clear memory
  // useEffect(() => {
  //   saveDeckListData([]);
  // }, []);

  // console.log("quizapp state " + JSON.stringify({ deckListData }));

  return (
    <ScreenTemplate>
      <Toolbar showBack={false} theme={theme} toggleTheme={toggleTheme} />
      <DeckList />
      <StatusBar style="dark" />
    </ScreenTemplate>
  );
};
