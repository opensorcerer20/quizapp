import {
  useEffect,
  useState,
} from "react";

import { useLocalSearchParams } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";

import {
  LINE_CHAR_LIMIT,
  THEMES,
} from "../common/constants";
import {
  loadDeckData,
  saveDeckData,
} from "../common/fileLib";
import { lightDarkStyles } from "../common/lib";
import { formatCardText } from "../common/util";
import { useTheme } from "../components/Providers/ThemeProvider";
import ScreenTemplate from "../components/ScreenTemplate";
import Toolbar from "../components/Toolbar";

const DeckScreen = () => {
  const { deckId } = useLocalSearchParams();
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentDeckData, setCurrentDeckData] = useState([]);

  const { theme, toggleTheme } = useTheme();
  const scheme = theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;

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
      <View key={item.id} style={[scheme.bg2, scheme.txt, styles.item]}>
        <Checkbox
          status={item.disabled ? "unchecked" : "checked"}
          onPress={() => onCheckboxClick(!item?.disabled, item.id)}
        />
        <View style={{ flexDirection: "col" }}>
          <Text style={[scheme.txt, styles.itemText]}>{formatCardText(`Q: ${item.q}`, LINE_CHAR_LIMIT)}</Text>
          <Text style={[scheme.txt, styles.itemText]}>{formatCardText(`A: ${item.a}`, LINE_CHAR_LIMIT)}</Text>
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
    <ScreenTemplate>
      <Toolbar title={currentDeck?.name || ""} theme={theme} toggleTheme={toggleTheme} />
      {currentDeckData && (
        <>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {[
              { icon: "✓", color: "green", label: "Enable All", onPress: () => onCheckboxClick(false) },
              { icon: "✕", color: "red", label: "Disable All", onPress: () => onCheckboxClick(true) },
            ].map(({ icon, color, label, onPress }) => (
              <Pressable key={label} style={[scheme.bg2, styles.blanketButton]} onPress={onPress}>
                <Text style={{ color }}>{icon}</Text>
                <Text style={scheme.txt}> {label}</Text>
              </Pressable>
            ))}
          </View>
          <FlatList data={currentDeckData.questions} renderItem={renderItem} />
        </>
      )}
      {!currentDeckData && <Text style={scheme.txt}>Loading question data...</Text>}
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "95%",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    margin: 2,
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
  },
  ...lightDarkStyles,
});

export default DeckScreen;
