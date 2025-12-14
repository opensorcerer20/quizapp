import { Modal, StyleSheet } from "react-native";

import Tutorial from "../app/Tutorial";
import { globalStyles } from "../common/lib";

const TutorialModal = ({ showModal, setShowModal, scheme }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => {
        setShowModal(false);
      }}
    >
      <Tutorial onClose={() => setShowModal(false)} />
    </Modal>
  );
};

const styles = StyleSheet.create({
  tutorialModal: {
    position: "absolute",
    borderRadius: 5,
    shadowColor: globalStyles.bgBlack.backgroundColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "flex-start", // removing this removes left padding for helpmenu
    borderRadius: 10,
    height: 300,
  },
});

export default TutorialModal;
