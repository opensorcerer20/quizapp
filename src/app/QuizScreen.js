import { useEffect, useState } from "react";

import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

import { loadDeckData, updateDeckQuestionData } from "../common/fileLib";
import { getScheme } from "../common/util";
import { useTheme } from "../components/Providers/ThemeProvider";
import { ReviewScreen } from "../components/Quiz/ReviewScreen";
import ScreenTemplate from "../components/ScreenTemplate";

/*
later there will be a quiz screen etc
*/

const QuizScreen = () => {
  const { deckId } = useLocalSearchParams();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentDeckQuestionData, setCurrentDeckQuestionData] = useState([]);

  const { theme, toggleTheme } = useTheme();
  const scheme = getScheme(theme);

  const updateQuestionData = async (id, newBag) => {
    await updateDeckQuestionData(id, newBag);
    setCurrentDeckQuestionData(newBag);
  };

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
      <>
        <ScreenTemplate title={"Review Deck"}>
          {!!currentDeck && (
            <ReviewScreen
              currentDeck={currentDeck}
              currentDeckQuestionData={currentDeckQuestionData}
              updateQuestionData={updateQuestionData}
            />
          )}
          {!currentDeck && <Text style={[scheme.txt, { padding: 10 }]}>Loading...</Text>}
        </ScreenTemplate>
      </>
    );
  }
  return <Text style={[scheme.txt, { padding: 10 }]}>Error: no screen specified</Text>;
};

export default QuizScreen;
