import {
  useEffect,
  useState,
} from "react";

import { useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
} from "react-native";

import { THEMES } from "../common/constants";
import { loadDeckData } from "../common/fileLib";
import { lightDarkStyles } from "../common/lib";
import { useTheme } from "../components/Providers/ThemeProvider";
import { ReviewScreen } from "../components/Quiz/ReviewScreen";
import ScreenTemplate from "../components/ScreenTemplate";
import Toolbar from "../components/Toolbar";

/*
later there will be a quiz screen etc
*/

const QuizScreen = () => {
  const { deckId } = useLocalSearchParams();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentDeckQuestionData, setCurrentDeckQuestionData] = useState([]);

  const { theme, toggleTheme } = useTheme();
  const scheme = theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;

  // WORKING
  useEffect(() => {
    if (deckId) {
      const asyncFunc = async () => {
        // note: tried to move set methods outside, but returning loaddeckdata from this func didnt work
        const result = await loadDeckData(deckId);
        if (Array.isArray(result) && result.length === 2) {
          const [selectedDeck, selectedDeckData] = result;
          setCurrentDeck(selectedDeck);
          setCurrentDeckQuestionData(selectedDeckData.questions);
        } else {
          console.log("Unexpected result loading deck with id " + deckId);
          setCurrentDeck(null);
          setCurrentDeckQuestionData([]);
        }
      };
      asyncFunc();
    } else {
      setCurrentDeck(null);
      setCurrentDeckQuestionData([]);
    }
  }, [deckId]);

  const whichScreen = "review";
  if (whichScreen === "review") {
    return (
      <ScreenTemplate>
        <Toolbar title={currentDeck?.name || ""} theme={theme} toggleTheme={toggleTheme} />

        <ReviewScreen currentDeck={currentDeck} currentDeckQuestionData={currentDeckQuestionData} />
      </ScreenTemplate>
    );
  }
  return <Text>Error: no screen specified</Text>;
};

const styles = StyleSheet.create({
  ...lightDarkStyles,
});

export default QuizScreen;
