import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { SAFE_WIDTH } from "../common/constants";
import { globalStyles } from "../common/lib";

const ConfirmModal = ({
  scheme,
  confirmModalVisible,
  handleCancel,
  handleConfirm,
  message = "You have unsaved data, do you want to discard it?",
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={confirmModalVisible}
      onRequestClose={handleCancel} // Handle Android back button
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.buttonContainer}>
            <Pressable onPress={handleCancel} onLongPress={handleCancel} style={[globalStyles.button, scheme.disabled]}>
              <Text style={[scheme.buttonTxt, { fontSize: 16 }]}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              onLongPress={handleConfirm}
              style={[globalStyles.button, scheme.buttonBg]}
            >
              <Text style={[scheme.buttonTxt, { fontSize: 16 }]}>Discard</Text>
            </Pressable>
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
    width: SAFE_WIDTH * 0.9,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000",
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
