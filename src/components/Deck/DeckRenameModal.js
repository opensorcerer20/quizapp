import { useEffect, useState } from "react";

import { trim } from "lodash";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";

import { globalStyles } from "../../common/lib";
import { getScheme } from "../../common/util";
import { useTheme } from "../Providers/ThemeProvider";
import { useLocale } from "../Providers/TranslationProvider";
import TextNormal from "../TextNormal";

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

  const submitBgStyle = submitEnabled ? scheme.buttonBg : scheme.bgDisabled;

  return (
    <View style={[styles.container, styles.centeredView]}>
      <View style={[styles.modalView, scheme.bgAccent3, scheme.border]}>
        <View>
          <TextNormal style={[scheme.txt, { paddingBottom: 10 }]}>{getLocalString("Name this deck")}</TextNormal>
        </View>
        <TextNormal style={styles.modalText}>
          <TextInput style={styles.textInput} onChangeText={onDeckNameUpdate} value={deckName} />
        </TextNormal>
        <View style={{ flex: 1, flexDirection: "row" }}>
          {showCancel && (
            <Pressable style={[styles.button, scheme.bgDisabled]} onPress={handleCancelClick}>
              <TextNormal style={[styles.textStyle, scheme.buttonTxt]}>{getLocalString("Cancel")}</TextNormal>
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
            <TextNormal style={[styles.textStyle, scheme.buttonTxt]}>{getLocalString("Submit")}</TextNormal>
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
    padding: 20,
    alignItems: "center",
    maxHeight: 170,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    padding: 4,
    backgroundColor: globalStyles.bgWhite.backgroundColor,
    width: 250,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    color: "black",
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
