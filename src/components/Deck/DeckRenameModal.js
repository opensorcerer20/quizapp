import { useEffect, useState } from "react";

import { trim } from "lodash";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { getScheme } from "../../common/util";
import { useTheme } from "../Providers/ThemeProvider";
import { useLocale } from "../Providers/TranslationProvider";

const DeckRenameModal = ({ initialDeckName, editingDeck, handleCancelClick, handleRenameDeck, showCancel = true }) => {
  const { getLocalString } = useLocale();
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

  const submitBgStyle = submitEnabled ? scheme.buttonBg : scheme.disabled;

  return (
    <View style={[styles.container, styles.centeredView]}>
      <View style={[styles.modalView, scheme.bgAccent1, scheme.border]}>
        <View>
          <Text style={[scheme.txt, { paddingBottom: 10 }]}>{getLocalString("Name this deck")}</Text>
        </View>
        <Text style={styles.modalText}>
          <TextInput style={styles.textInput} onChangeText={onDeckNameUpdate} value={deckName} />
        </Text>
        <View style={{ flex: 1, flexDirection: "row" }}>
          {showCancel && (
            <Pressable style={[styles.button, scheme.disabled]} onPress={handleCancelClick}>
              <Text style={[styles.textStyle, scheme.buttonTxt]}>{getLocalString("Cancel")}</Text>
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
            <Text style={[styles.textStyle, scheme.buttonTxt]}>{getLocalString("Submit")}</Text>
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
