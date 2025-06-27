import { useEffect, useState } from "react";

import { trim } from "lodash";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { getScheme } from "../../common/util";
import { useTheme } from "../Providers/ThemeProvider";

const DeckRenameModal = ({ initialDeckName, editingDeck, handleCancelClick, handleRenameDeck, showCancel = true }) => {
  const [deckName, setDeckName] = useState("");
  const [submitEnabled, setSubmitEnabled] = useState(true);

  const { theme } = useTheme();
  const scheme = getScheme(theme);

  const onDeckNameUpdate = (text) => {
    setDeckName(text);
    setSubmitEnabled(trim(text) != "");
  };

  useEffect(() => {
    setDeckName(initialDeckName);
  }, []);

  const submitBgStyle = submitEnabled ? scheme.bgAccent1 : scheme.bgPrimary;

  return (
    <View style={[styles.container, styles.centeredView]}>
      <View style={[styles.modalView, scheme.bgPrimary, scheme.border]}>
        <View>
          <Text style={[scheme.txt, { paddingBottom: 10 }]}>Name this deck</Text>
        </View>
        <Text style={styles.modalText}>
          <TextInput style={styles.textInput} onChangeText={onDeckNameUpdate} value={deckName} />
        </Text>
        <View style={{ flex: 1, flexDirection: "row" }}>
          {showCancel && (
            <Pressable style={[styles.button, scheme.bgSecondary]} onPress={handleCancelClick}>
              <Text style={[styles.textStyle, scheme.txt]}>Cancel</Text>
            </Pressable>
          )}
          <Pressable
            style={[styles.button, submitBgStyle]}
            onPress={() => {
              if (submitEnabled) {
                handleRenameDeck(editingDeck.id, deckName);
              }
            }}
          >
            <Text style={[styles.textStyle, scheme.txt]}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalView: {
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    maxHeight: 200,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    padding: 4,
    backgroundColor: "white",
    width: 200,
    borderRadius: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    borderRadius: 10,
    height: Platform.select({
      ios: 30,
      android: 40,
    }),
    margin: 5,
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  buttonSubmit: {
    backgroundColor: "darkblue",
  },
  buttonCancel: {
    backgroundColor: "grey",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DeckRenameModal;
