import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

const ConfirmModal = ({
  scheme,
  prompt,
  cancelText,
  confirmText,
  confirmModalVisible,
  handleCancel,
  handleConfirm,
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
          <Text style={styles.modalText}>{prompt}</Text>
          <View style={styles.buttonContainer}>
            <Pressable onPress={handleCancel} onLongPress={handleCancel} style={[scheme.disabled, styles.buttonStyle]}>
              <Text style={[scheme.buttonTxt, styles.buttonTextStyle]}>{cancelText}</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              onLongPress={handleConfirm}
              style={[scheme.buttonBg, styles.buttonStyle]}
            >
              <Text style={[scheme.buttonTxt, styles.buttonTextStyle]}>{confirmText}</Text>
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
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonStyle: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonTextStyle: {
    fontSize: 16,
  },
});

export default ConfirmModal;
