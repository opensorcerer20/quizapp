import { Modal, Pressable, StyleSheet, View } from "react-native";

import { globalStyles } from "../common/lib";

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
    color: globalStyles.txtWhite.color,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default QuizModal;
