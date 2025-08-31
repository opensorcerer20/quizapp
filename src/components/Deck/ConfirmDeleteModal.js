import QuizModal from "../QuizModal";
import ConfirmDelete from "./ConfirmDelete";

const ConfirmDeleteModal = ({ modalVisible, handleModalClickAway, scheme, handleCancelClick, handleConfirmClick }) => {
  return (
    <QuizModal modalVisible={modalVisible} handleModalClickAway={handleModalClickAway}>
      <ConfirmDelete scheme={scheme} handleCancelClick={handleCancelClick} handleConfirmClick={handleConfirmClick} />
    </QuizModal>
  );
};

export default ConfirmDeleteModal;
