import { Modal, Pressable, StyleSheet, View } from "react-native";

const QuizModal = ({
  modalVisible = false,
  handleModalClickAway = () => {},
  modalContainerStyle = [],
  modalStyle = [],
  children,
}) => {
  if (!Array.isArray(modalContainerStyle)) {
    modalContainerStyle = [modalContainerStyle];
  }

  return (
    <Modal transparent animationType="fade" visible={modalVisible}>
      <Pressable style={styles.overlay} onPress={() => handleModalClickAway()}>
        <View style={[styles.centeredView, ...modalContainerStyle]}>
          <Pressable onPress={() => {}}>
            <View style={modalStyle}>{children}</View>
          </Pressable>
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
  },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default QuizModal;
