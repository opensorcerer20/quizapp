import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  SAFE_WIDTH,
  SCREEN_HEIGHT,
} from "../common/constants";
import { globalStyles } from "../common/lib";
import TextNormal from "./TextNormal";

const ConfirmModalButton = ({ scheme, handlePress, bgstyle, label, disabled = false }) => {
  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handlePress}
      style={[globalStyles.button, bgstyle]}
      disabled={disabled}
    >
      <TextNormal style={[scheme.buttonTxt, { fontSize: 16 }]}>{label}</TextNormal>
    </Pressable>
  );
};

const ConfirmModal = ({
  scheme,
  modalVisible,
  handleCancel,
  handleConfirm,
  message,
  cancelLabel = "Cancel",
  confirmLabel = "Accept",
  submitEnabled = true,
  children,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCancel} // Handle Android back button
    >
      <View style={styles.centeredView}>
        <View style={[scheme.modalBg, styles.modalView, { position: "absolute", top: SCREEN_HEIGHT / 2 - 100 }]}>
          <TextNormal style={[scheme.txt, styles.modalText]}>{message}</TextNormal>
          {children}
          <View style={styles.buttonContainer}>
            <ConfirmModalButton
              scheme={scheme}
              handlePress={handleCancel}
              label={cancelLabel}
              bgstyle={scheme.bgDisabled}
            />
            <ConfirmModalButton
              scheme={scheme}
              handlePress={handleConfirm}
              label={confirmLabel}
              bgstyle={scheme.buttonBg}
              disabled={!submitEnabled}
            />
          </View>
        </View>
      </View>
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
    width: SAFE_WIDTH,
    margin: 20,
    borderRadius: 10,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
  },
});

export default ConfirmModal;
