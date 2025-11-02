import { useCallback, useEffect, useState } from "react";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { FlatList, Platform, Pressable, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MAX_QUESTIONS } from "../common/constants";
import { loadAllDecks, loadDeckData, saveDeckData, saveDeckListData, updateDeckQuestionData } from "../common/fileLib";
import { globalStyles } from "../common/lib";
import { getScheme } from "../common/util";
import DeckRenameModal from "../components/Deck/DeckRenameModal";
import DeckScreenItem from "../components/Deck/DeckScreenItem";
import DeckTitle from "../components/Deck/DeckTitle";
import { useTheme } from "../components/Providers/ThemeProvider";
import ScreenTemplate from "../components/ScreenTemplate";
import TextNormal from "../components/TextNormal";

const DeckScreen = () => {
  const { deckId } = useLocalSearchParams();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentDeckData, setCurrentDeckData] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  const handleRenameDeck = async (deckId, newName) => {
    // currently, to rename one deck, it's in a list in local memory, so the list needs to be updated
    const deckListData = await loadAllDecks();
    let updatedDeck = deckListData.filter((deck) => deck.id == deckId);
    if (updatedDeck.length === 1) {
      updatedDeck[0].name = newName;
      const newDeckListData = deckListData.map((deck) => {
        if (deck.id === deckId) {
          return updatedDeck[0];
        }
        return deck;
      });

      saveDeckListData(newDeckListData);
      setCurrentDeck(updatedDeck[0]);
      setShowModal(false);
    } else {
      console.log("couldnt edit deck with id " + deckId);
    }
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
        {currentDeck && (
          <DeckTitle
            deckName={currentDeck.name}
            scheme={scheme}
            showEdit={true}
            onEditPress={() => setShowModal(true)}
          />
        )}
        {!questionsExist && (
          <View style={styles.container}>
            <TextNormal style={{ fontSize: Platform.OS === "ios" ? 24 : 20 }}>
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
                <Pressable key={label} style={[scheme.buttonBg, styles.button]} onPress={onPress}>
                  <TextNormal style={{ color, fontSize: 18, marginHorizontal: 3 }}>{icon}</TextNormal>
                  <TextNormal style={{ color, fontSize: 18, marginHorizontal: 3 }}>{label}</TextNormal>
                </Pressable>
              ))}
            </View>
            <GestureHandlerRootView>
              <FlatList
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: insets.bottom }}
                data={currentDeckData.questions}
                renderItem={(item) => (
                  <DeckScreenItem
                    item={item.item}
                    scheme={scheme}
                    onVisibilityClick={onVisibilityClick}
                    handleDeleteConfirmClick={handleDeleteConfirmClick}
                  />
                )}
              />
            </GestureHandlerRootView>
          </>
        )}
        {!currentDeckData && <TextNormal style={scheme.txt}>Loading question data...</TextNormal>}
        <FAB
          icon="plus"
          style={[globalStyles.fab, canAddQuestion ? scheme.buttonBg : scheme.bgDisabled]}
          color={scheme.buttonTxt.color}
          onPress={canAddQuestion ? onAddQuestion : () => {}}
        />
        {currentDeck && (
          <DeckRenameModal
            initialDeckName={currentDeck.name}
            editingDeckId={deckId}
            handleCancelClick={() => setShowModal(false)}
            handleRenameDeck={handleRenameDeck}
            showCancel={true}
            visible={showModal}
          />
        )}
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
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
    margin: 5,
    borderWidth: 1,
    borderColor: "#00000066",
  },
});

export default DeckScreen;
