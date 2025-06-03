import { useEffect, useState } from "react";

import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { THEMES, VIEWS } from "../common/constants";
import { loadDeckFromStorage, loadQuestionsFromStorage } from "../common/fileLib";
import { lightDarkStyles } from "../common/lib";
import { useTheme } from "../components/Providers/ThemeProvider";
import { ReviewScreen } from "../components/Quiz/ReviewScreen";
import Toolbar from "../components/Toolbar";

/*
later there will be a quiz screen etc
*/

const QuizScreen = () => {
  const { deckId } = useLocalSearchParams();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentDeckData, setCurrentDeckData] = useState([]);

  const { theme } = useTheme();
  const scheme = theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;

  const backCall = () => {
    router.back();
  };

  useEffect(() => {
    if (deckId) {
      const asyncFunc = async () => {
        const selectedDeck = await loadDeckFromStorage(deckId);
        const selectedDeckData = await loadQuestionsFromStorage(deckId);
        if (selectedDeck && Array.isArray(selectedDeckData?.questions) && selectedDeckData.questions.length) {
          setCurrentDeck(selectedDeck);
          setCurrentDeckData(selectedDeckData.questions);
        }
      };
      asyncFunc();
    } else {
      setCurrentDeck(null);
      setCurrentDeckData([]);
    }
  }, [deckId]);

  const whichScreen = "review";
  if (whichScreen === "review") {
    return (
      <View style={[styles.container, scheme.bg, scheme.txt]}>
        <Toolbar
          style={styles.toolbarContainer}
          currentView={VIEWS.quizView}
          title={currentDeck?.name || ""}
          backCallback={backCall}
        />

        <ReviewScreen currentDeck={currentDeck} currentDeckData={currentDeckData} />
      </View>
    );
  }
  return <Text>Error: no screen specified</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbarContainer: {
    flex: 1,
  },
  ...lightDarkStyles,
});

export default QuizScreen;
