import { useEffect, useState } from "react";

import { trim } from "lodash";
import { Platform, StyleSheet, TextInput } from "react-native";

import { globalStyles } from "../../common/lib";
import { getScheme } from "../../common/util";
import ConfirmModal from "../ConfirmModal";
import { useTheme } from "../Providers/ThemeProvider";
import { useLocale } from "../Providers/TranslationProvider";
import TextNormal from "../TextNormal";

const DeckRenameModal = ({ initialDeckName, editingDeckId, handleCancelClick, handleRenameDeck, visible = false }) => {
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
  }, [initialDeckName]);

  return (
    <ConfirmModal
      scheme={scheme}
      modalVisible={visible}
      handleCancel={handleCancelClick}
      handleConfirm={() => handleRenameDeck(editingDeckId, deckName)}
      message={getLocalString("Name this deck")}
      submitEnabled={submitEnabled}
    >
      <TextNormal style={styles.modalText}>
        <TextInput style={styles.textInput} onChangeText={onDeckNameUpdate} value={deckName} />
      </TextNormal>
    </ConfirmModal>
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
