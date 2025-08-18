import { useCallback, useEffect, useState } from "react";

import Checkbox from "expo-checkbox";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { FAB } from "react-native-paper";

import { MAX_QUESTIONS, THEMES } from "../common/constants";
import { loadDeckData, saveDeckData } from "../common/fileLib";
import { globalStyles } from "../common/lib";
import { formatCardText, getScheme } from "../common/util";
import DeckTitle from "../components/Deck/DeckTitle";
import { useTheme } from "../components/Providers/ThemeProvider";
import ScreenTemplate from "../components/ScreenTemplate";

const DeckScreen = () => {
  const { deckId } = useLocalSearchParams();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentDeckData, setCurrentDeckData] = useState([]);

  const { theme, toggleTheme } = useTheme();
  const scheme = getScheme(theme);

  const onAddQuestion = () => {
    router.navigate({
      pathname: "AddQuestion",
      params: { deckId },
    });
  };

  // sets either all checkboxes or specific checkbox "disabled" property
  const onCheckboxClick = (disabledValue, id = null) => {
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
      <View key={item.id} style={[scheme.bgAccent3, styles.item, { borderColor: scheme.txt.color }]}>
        <Checkbox
          color={theme === THEMES.dark ? scheme.antiTxtBg.backgroundColor : scheme.txt.color}
          style={globalStyles.checkbox}
          value={!item.disabled}
          onValueChange={() => onCheckboxClick(!item?.disabled, item.id)}
        />
        <View style={{ flexDirection: "col", width: "95%" }}>
          <Text style={[scheme.txt, styles.itemText]}>{formatCardText(`Q: ${item.q}`)}</Text>
          <Text style={[scheme.txt, styles.itemText]}>{formatCardText(`A: ${item.a}`)}</Text>
        </View>
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
                  onPress: () => onCheckboxClick(true),
                },
                {
                  icon: "✓",
                  color: scheme.buttonTxt.color,
                  label: "Show All Cards",
                  onPress: () => onCheckboxClick(false),
                },
              ].map(({ icon, color, label, onPress }) => (
                <Pressable
                  key={label}
                  style={[globalStyles.button, scheme.buttonBg, styles.setAllButton]}
                  onPress={onPress}
                >
                  <Text style={{ color }}>{icon}</Text>
                  <Text style={{ color }}> {label}</Text>
                </Pressable>
              ))}
            </View>
            <FlatList
              keyExtractor={(item) => item.id}
              style={{ width: "100%" }}
              data={currentDeckData.questions}
              renderItem={renderItem}
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
  },
  itemText: {
    fontSize: 16,
    maxWidth: "90%",
  },
});

export default DeckScreen;
