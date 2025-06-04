import { useEffect, useState } from "react";

import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text } from "react-native";

import { loadDeckData } from "../common/fileLib";
import { lightDarkStyles } from "../common/lib";
import ScreenTemplate from "../components/ScreenTemplate";
import Toolbar from "../components/Toolbar";

const DeckScreen = () => {
  const { deckId } = useLocalSearchParams();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentDeckQuestionData, setCurrentDeckQuestionData] = useState([]);

  useEffect(() => {
    if (deckId) {
      const asyncFunc = async () => {
        return await loadDeckData(deckId);
      };
      const [selectedDeck, selectedDeckData] = asyncFunc();
      setCurrentDeck(selectedDeck);
      setCurrentDeckQuestionData(selectedDeckData.questions);
    } else {
      setCurrentDeck(null);
      setCurrentDeckQuestionData([]);
    }
  }, [deckId]);

  return (
    <ScreenTemplate>
      <Toolbar title={currentDeck?.name || ""} />

      <Text>deck screen</Text>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  ...lightDarkStyles,
});

export default DeckScreen;
