import { useEffect, useState } from "react";

import { useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";

import { loadDeckData, saveDeckData } from "../common/fileLib";
import { formatCardText, getScheme } from "../common/util";
import { useTheme } from "../components/Providers/ThemeProvider";
import ScreenTemplate from "../components/ScreenTemplate";
import Toolbar from "../components/Toolbar";

const DeckScreen = () => {
  const { deckId } = useLocalSearchParams();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentDeckData, setCurrentDeckData] = useState([]);

  const { theme, toggleTheme } = useTheme();
  const scheme = getScheme(theme);

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
      <View key={item.id} style={[scheme.bgAccent3, scheme.txt, styles.item]}>
        <Checkbox
          status={item.disabled ? "unchecked" : "checked"}
          onPress={() => onCheckboxClick(!item?.disabled, item.id)}
        />
        <View style={{ flexDirection: "col", width: "95%" }}>
          <Text style={[scheme.txt, styles.itemText]}>{formatCardText(`Q: ${item.q}`)}</Text>
          <Text style={[scheme.txt, styles.itemText]}>{formatCardText(`A: ${item.a}`)}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (deckId) {
      const asyncFunc = async () => {
        // note: tried to move set methods outside, but returning loaddeckdata from this func didnt work
        const result = await loadDeckData(deckId);
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
      asyncFunc();
    } else {
      setCurrentDeck(null);
      setCurrentDeckData([]);
    }
  }, [deckId]);

  // console.log("questiondata " + JSON.stringify(currentDeckData));

  return (
    <>
      <Toolbar title={currentDeck?.name || ""} themeSetting={theme} toggleTheme={toggleTheme} />
      <ScreenTemplate>
        {currentDeckData && (
          <>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              {[
                { icon: "✓", color: "green", label: "Enable All", onPress: () => onCheckboxClick(false) },
                { icon: "✕", color: "red", label: "Disable All", onPress: () => onCheckboxClick(true) },
              ].map(({ icon, color, label, onPress }) => (
                <Pressable key={label} style={[scheme.bgAccent3, styles.blanketButton]} onPress={onPress}>
                  <Text style={{ color }}>{icon}</Text>
                  <Text style={scheme.txt}> {label}</Text>
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
  },
  blanketButton: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  itemText: {
    fontSize: 16,
    maxWidth: "90%",
  },
});

export default DeckScreen;
