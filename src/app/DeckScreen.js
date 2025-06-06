import {
  useEffect,
  useState,
} from "react";

import { useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { THEMES } from "../common/constants";
import { loadDeckData } from "../common/fileLib";
import { lightDarkStyles } from "../common/lib";
import { useTheme } from "../components/Providers/ThemeProvider";
import ScreenTemplate from "../components/ScreenTemplate";
import Toolbar from "../components/Toolbar";

const DeckScreen = () => {
  const { deckId } = useLocalSearchParams();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentDeckQuestionData, setCurrentDeckQuestionData] = useState([]);

  const { theme, toggleTheme } = useTheme();
  const scheme = theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;

  useEffect(() => {
    if (deckId) {
      const asyncFunc = async () => {
        // note: tried to move set methods outside, but returning loaddeckdata from this func didnt work
        const result = await loadDeckData(deckId);
        console.log("result " + JSON.stringify(result));
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

  console.log("questiondata " + JSON.stringify(currentDeckQuestionData));

  return (
    <ScreenTemplate>
      <Toolbar title={currentDeck?.name || ""} theme={theme} toggleTheme={toggleTheme} />

      {currentDeckQuestionData.length > 0 &&
        currentDeckQuestionData.map((questionDatum) => (
          <View key={questionDatum.id} style={scheme.bg}>
            <Text key={questionDatum.id} style={scheme.txt}>
              Q: {questionDatum.q}
            </Text>
            <Text key={questionDatum.id} style={scheme.txt}>
              A: {questionDatum.a}
            </Text>
          </View>
        ))}
      {currentDeckQuestionData.length === 0 && <Text style={scheme.txt}>Loading question data...</Text>}
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  ...lightDarkStyles,
});

export default DeckScreen;
