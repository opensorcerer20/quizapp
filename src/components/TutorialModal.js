import { Modal } from "react-native";

import Tutorial from "../app/Tutorial";

const TutorialModal = ({ showModal, setShowModal }) => {
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

export default TutorialModal;
