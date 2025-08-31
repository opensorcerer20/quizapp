import { useCallback, useEffect, useState } from "react";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { FAB } from "react-native-paper";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { MAX_QUESTIONS, SAFE_WIDTH } from "../common/constants";
import { loadDeckData, saveDeckData, updateDeckQuestionData } from "../common/fileLib";
import { globalStyles } from "../common/lib";
import { formatCardText, getScheme } from "../common/util";
import ConfirmDeleteModal from "../components/Deck/ConfirmDeleteModal";
import DeckTitle from "../components/Deck/DeckTitle";
import { useTheme } from "../components/Providers/ThemeProvider";
import ScreenTemplate from "../components/ScreenTemplate";

const DeckScreen = () => {
  const { deckId } = useLocalSearchParams();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentDeckData, setCurrentDeckData] = useState([]);
  const [deleteCardId, setDeleteCardId] = useState(null);

  const { theme, toggleTheme } = useTheme();
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
    newCurrentDeckData.questions = newCurrentDeckData.questions.map((questionDatum) => {
      if (!id || questionDatum.id === id) {
        questionDatum.disabled = disabledValue;
      }
      return questionDatum;
    });
    saveDeckData(currentDeck.id, newCurrentDeckData);
    setCurrentDeckData(newCurrentDeckData);
  };

  const renderItem = ({ item }) => {
    return (
      <View
        key={item.id}
        style={[scheme.bgAccent3, styles.item, { borderColor: scheme.txt.color, flexDirection: "row" }]}
      >
        <Pressable
          style={{ flex: 1, paddingHorizontal: item.disabled ? 10 : 12, maxWidth: 50 }}
          onPress={() => onVisibilityClick(!item?.disabled, item.id)}
          onLongPress={() => onVisibilityClick(!item?.disabled, item.id)}
        >
          <FontAwesome6
            name={item.disabled ? "eye-slash" : "eye"}
            size={20}
            color={scheme.txt.color}
            style={styles.menuIcon}
          />
        </Pressable>
        <View style={{ flexDirection: "col", maxWidth: SAFE_WIDTH * 0.7, flex: 10 }}>
          <Text style={[scheme.txt, styles.itemText]}>
            <Text style={{ fontWeight: "bold" }}>Q: </Text>
            {formatCardText(`${item.q}`)}
          </Text>
          <Text style={[scheme.txt, styles.itemText]}>
            <Text style={{ fontWeight: "bold" }}>A: </Text>
            {formatCardText(`${item.a}`)}
          </Text>
        </View>
        <Pressable onPress={() => setDeleteCardId(item.id)}>
          <View>
            <FontAwesome6 name="trash" size={20} color={scheme.txt.color} style={styles.menuIcon} />
          </View>
        </Pressable>
      </View>
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

  const handleDeleteCancelClick = () => {
    setDeleteCardId(null);
  };

  const handleDeleteConfirmClick = async () => {
    const newQuestions = currentDeckData.questions.filter((question) => question.id !== deleteCardId);
    await updateDeckQuestionData(currentDeck.id, newQuestions);
    await loadDeckDataFromStorage();
    setDeleteCardId(null);
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

  const canAddQuestion = currentDeckData?.questions?.length < MAX_QUESTIONS;

  // console.log("questiondata " + JSON.stringify(currentDeckData));

  return (
    <>
      <ScreenTemplate title={"Deck Settings"} hideButtons={true}>
        {currentDeck && <DeckTitle deckName={currentDeck.name} scheme={scheme} />}
        {currentDeckData && (
          <>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              {[
                {
                  icon: "✕",
                  color: scheme.buttonTxt.color,
                  label: "Hide All Cards",
                  onPress: () => onVisibilityClick(true),
                },
                {
                  icon: "✓",
                  color: scheme.buttonTxt.color,
                  label: "Show All Cards",
                  onPress: () => onVisibilityClick(false),
                },
              ].map(({ icon, color, label, onPress }) => (
                <Pressable
                  key={label}
                  style={[globalStyles.button, scheme.buttonBg, styles.setAllButton]}
                  onPress={onPress}
                >
                  <Text style={{ color }}>{icon}</Text>
                  <Text style={{ color, paddingHorizontal: 5 }}>{label}</Text>
                </Pressable>
              ))}
            </View>
            <FlatList
              keyExtractor={(item) => item.id}
              style={{ width: "100%" }}
              data={currentDeckData.questions}
              renderItem={renderItem}
            />
            <ConfirmDeleteModal
              modalVisible={deleteCardId !== null}
              handleModalClickAway={handleDeleteCancelClick}
              scheme={scheme}
              handleCancelClick={handleDeleteCancelClick}
              handleConfirmClick={handleDeleteConfirmClick}
            />
          </>
        )}
        {!currentDeckData && <Text style={scheme.txt}>Loading question data...</Text>}
        <FAB
          icon="plus"
          style={[globalStyles.fab, canAddQuestion ? scheme.buttonBg : scheme.disabled]}
          color={scheme.buttonTxt.color}
          onPress={canAddQuestion ? onAddQuestion : () => {}}
        />
      </ScreenTemplate>
    </>
  );
};

const styles = StyleSheet.create({
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
