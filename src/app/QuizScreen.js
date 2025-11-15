import { useEffect, useState } from "react";

import { useLocalSearchParams } from "expo-router";

import { loadDeckData, updateDeckQuestionData } from "../common/fileLib";
import { getScheme } from "../common/util";
import { useTheme } from "../components/Providers/ThemeProvider";
import { useLocale } from "../components/Providers/TranslationProvider";
import { ReviewScreen } from "../components/Quiz/ReviewScreen";
import ScreenTemplate from "../components/ScreenTemplate";
import TextNormal from "../components/TextNormal";

/*
later there will be a quiz screen etc
*/

const QuizScreen = () => {
  const { getLocalString } = useLocale();
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

  // hard coded, change when other views implemented (like quiz view)
  const whichScreen = "review";

  if (whichScreen === "review") {
    return (
      <>
        <ScreenTemplate title={"Review Deck"} helpType={"review"}>
          {!!currentDeck && (
            <ReviewScreen
              currentDeck={currentDeck}
              currentDeckQuestionData={currentDeckQuestionData}
              updateQuestionData={updateQuestionData}
            />
          )}
          {!currentDeck && (
            <TextNormal style={[scheme.txt, { padding: 10 }]}>{getLocalString("Loading")}...</TextNormal>
          )}
        </ScreenTemplate>
      </>
    );
  }
  return <TextNormal style={[scheme.txt, { padding: 10 }]}>{getLocalString("Error: no screen specified")}</TextNormal>;
};

export default QuizScreen;
