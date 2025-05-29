import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../Providers/ThemeProvider";
import { THEMES } from "../constants";
import { lightDarkStyles } from "../lib";

const DeckListEditModal = ({
  initialDeckName,
  editingDeck,
  handleCancelClick,
  handleRenameDeck,
  showCancel = true,
}) => {
  const [deckName, setDeckName] = useState("");

  const { theme } = useTheme();
  const scheme = theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;

  useEffect(() => {
    setDeckName(initialDeckName);
  }, []);

  return (
    <View style={[styles.centeredView, styles.overlay]}>
      <View style={[styles.modalView, scheme.bg2, scheme.border]}>
        <Text style={styles.modalText}>
          <TextInput
            style={styles.textInput}
            placeholder={editingDeck.name}
            onChangeText={setDeckName}
            value={deckName}
          />
        </Text>
        <View style={{ flex: 1, flexDirection: "row" }}>
          {showCancel && (
            <Pressable style={[styles.button, styles.buttonCancel]} onPress={handleCancelClick}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          )}
          <Pressable
            style={[styles.button, styles.buttonSubmit]}
            onPress={() => handleRenameDeck(editingDeck.id, deckName)}
          >
            <Text style={styles.textStyle}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 150,
  },
  textStyle: {
    color: "white",
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
    elevation: 2,
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
  ...lightDarkStyles,
});

export default DeckListEditModal;
