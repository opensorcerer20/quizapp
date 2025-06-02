import { Modal, Pressable, StyleSheet, View } from "react-native";

//<Modal modalVisible={modalVisible} setModalVisible={setModalVisible}><Text>modal content</Text></Modal>

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
  // if (!Array.isArray(modalStyle)) {
  //     modalStyle = [modalStyle];
  // }

  return (
    <Modal transparent animationType="fade" visible={modalVisible}>
      <Pressable style={styles.overlay} onPress={() => handleModalClickAway()}>
        <View style={[styles.centeredView, ...modalContainerStyle]}>
          <View style={modalStyle}>{children}</View>
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
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)" },
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
