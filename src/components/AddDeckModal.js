import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { globalStyles } from "../common/lib";
import { useLocale } from "./Providers/TranslationProvider";
import TextNormal from "./TextNormal";

const AddDeckButton = ({ scheme, onPressBtn, callback, label, icon }) => (
  <Pressable
    style={{ alignItems: "center", marginVertical: 10, marginHorizontal: 5 }}
    onPress={() => onPressBtn(callback)}
  >
    <View style={[globalStyles.fabButton, scheme.buttonBg, { borderColor: scheme.txt.color, marginVertical: 10 }]}>
      <MaterialCommunityIcons name={icon} size={36} color={scheme.txtForBg.color} testID={label} />
    </View>
    <TextNormal style={[scheme.txt, { fontSize: 16 }]}>{label}</TextNormal>
  </Pressable>
);

const AddDeckModal = ({ showModal, setShowModal, onPressCreate, onPressTxt, onPressCsv, onPressHelp, scheme }) => {
  const { getLocalString } = useLocale();
  const onPressBtn = (callback) => {
    setShowModal(false);
    callback();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal(false)} // Handle Android back button
    >
      <Pressable style={styles.centeredView} onPress={() => setShowModal(false)}>
        <View style={[scheme.modalBg, styles.modalView, { position: "absolute", top: 50 }]}>
          <View style={{ flexDirection: "column" }}>
            <AddDeckButton
              scheme={scheme}
              onPressBtn={onPressBtn}
              callback={onPressCreate}
              icon="form-textbox"
              label={getLocalString("Create Deck")}
            />
            <AddDeckButton
              scheme={scheme}
              onPressBtn={onPressBtn}
              callback={onPressTxt}
              icon="text"
              label={getLocalString("Import TXT")}
            />
            <AddDeckButton
              scheme={scheme}
              onPressBtn={onPressBtn}
              callback={onPressCsv}
              icon="table"
              label={getLocalString("Import CSV")}
            />
            <AddDeckButton
              scheme={scheme}
              onPressBtn={onPressBtn}
              callback={onPressHelp}
              icon="help"
              label={getLocalString("File Help")}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: globalStyles.bgBlack.backgroundColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default AddDeckModal;
