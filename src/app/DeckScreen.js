import { useCallback, useEffect, useState } from "react";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { FlatList, Platform, Pressable, StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MAX_QUESTIONS, SAFE_WIDTH } from "../common/constants";
import { loadDeckData, saveDeckData, updateDeckQuestionData } from "../common/fileLib";
import { globalStyles } from "../common/lib";
import { getScheme } from "../common/util";
import DeckScreenItem from "../components/Deck/DeckScreenItem";
import DeckTitle from "../components/Deck/DeckTitle";
import { useTheme } from "../components/Providers/ThemeProvider";
import ScreenTemplate from "../components/ScreenTemplate";
import TextNormal from "../components/TextNormal";

const DeckScreen = () => {
  const { deckId } = useLocalSearchParams();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentDeckData, setCurrentDeckData] = useState([]);

  const { theme } = useTheme();
  const scheme = getScheme(theme);

  const onAddQuestion = () => {
    router.navigate({
      pathname: "AddQuestion",
      params: { deckId },
    });
  };

  // sets either all checkboxes or specific checkbox "disabled" property
  const onVisibilityClick = (disabledValue, id = null) => {
    let newCurrentDeckData = JSON.parse(JSON.stringify(currentDeckData));
    if (newCurrentDeckData.questions) {
      newCurrentDeckData.questions = newCurrentDeckData.questions.map((questionDatum) => {
        if (!id || questionDatum.id === id) {
          questionDatum.disabled = disabledValue;
        }
        return questionDatum;
      });
      saveDeckData(currentDeck.id, newCurrentDeckData);
      setCurrentDeckData(newCurrentDeckData);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <DeckScreenItem
        item={item}
        scheme={scheme}
        onVisibilityClick={onVisibilityClick}
        handleDeleteConfirmClick={handleDeleteConfirmClick}
      />
    );
  };

  const loadDeckDataFromStorage = async () => {
    const result = await loadDeckData(deckId);
    // @todo not happy with this looking for result length 2
    if (Array.isArray(result) && result.length === 2) {
      const [selectedDeck, selectedDeckData] = result;
      setCurrentDeck(selectedDeck);
      setCurrentDeckData(selectedDeckData);
    } else {
      console.log("Unexpected result loading deck with id " + deckId);
      setCurrentDeck(null);
      setCurrentDeckData([]);
    }
  };

  const handleDeleteConfirmClick = async (deleteCardId) => {
    const newQuestions = currentDeckData.questions.filter((question) => question.id !== deleteCardId);
    await updateDeckQuestionData(currentDeck.id, newQuestions);
    await loadDeckDataFromStorage();
  };

  // specific to expo router
  useFocusEffect(
    useCallback(() => {
      // re-fetch data
      const loadData = async () => {
        await loadDeckDataFromStorage();
      };
      loadData();
    }, [])
  );

  useEffect(() => {
    if (deckId) {
      const loadData = async () => {
        await loadDeckDataFromStorage();
      };
      loadData();
    } else {
      setCurrentDeck(null);
      setCurrentDeckData([]);
    }
  }, [deckId]);

  const canAddQuestion = !currentDeckData?.questions?.length || currentDeckData.questions.length < MAX_QUESTIONS;
  const questionsExist = currentDeckData && currentDeckData?.questions;
  const insets = useSafeAreaInsets();

  // console.log("questiondata " + JSON.stringify(currentDeckData));

  return (
    <>
      <ScreenTemplate title={"Deck Settings"} hideButtons={true}>
        {currentDeck && <DeckTitle deckName={currentDeck.name} scheme={scheme} />}
        {!questionsExist && (
          <View style={styles.container}>
            <TextNormal style={{ fontSize: Platform.OS === "ios" ? 20 : 16 }}>
              There are no questions in this deck, add one with the add button below
            </TextNormal>
          </View>
        )}
        {questionsExist && (
          <>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              {[
                {
                  icon: "✕",
                  color: scheme.buttonTxt.color,
                  label: "Hide All",
                  onPress: () => onVisibilityClick(true),
                },
                {
                  icon: "✓",
                  color: scheme.buttonTxt.color,
                  label: "Show All",
                  onPress: () => onVisibilityClick(false),
                },
              ].map(({ icon, color, label, onPress }) => (
                <Pressable
                  key={label}
                  style={[globalStyles.button, scheme.buttonBg, styles.setAllButton]}
                  onPress={onPress}
                >
                  <TextNormal style={{ color }}>{icon}</TextNormal>
                  <TextNormal style={{ color, paddingHorizontal: 5 }}>{label}</TextNormal>
                </Pressable>
              ))}
            </View>
            <FlatList
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: insets.bottom }}
              style={{ width: "100%" }}
              data={currentDeckData.questions}
              renderItem={renderItem}
            />
          </>
        )}
        {!currentDeckData && <TextNormal style={scheme.txt}>Loading question data...</TextNormal>}
        <FAB
          icon="plus"
          style={[globalStyles.fab, canAddQuestion ? scheme.buttonBg : scheme.bgDisabled]}
          color={scheme.buttonTxt.color}
          onPress={canAddQuestion ? onAddQuestion : () => {}}
        />
      </ScreenTemplate>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginHorizontal: "auto",
    marginTop: 10,
  },
  item: {
    width: "90%",
    flexDirection: "row",
    paddingRight: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginVertical: 2,
    marginHorizontal: "auto",
    alignItems: "center",
    borderWidth: 1,
  },
  setAllButton: {
    flexDirection: "row",
    maxWidth: SAFE_WIDTH * 0.4,
  },
  itemText: {
    fontSize: 16,
    maxWidth: "90%",
  },
});

export default DeckScreen;
