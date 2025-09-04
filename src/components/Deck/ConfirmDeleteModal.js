import QuizModal from "../QuizModal";
import ConfirmDelete from "./ConfirmDelete";

const ConfirmDeleteModal = ({
  modalVisible,
  handleModalClickAway,
  scheme,
  handleCancelClick,
  handleConfirmClick,
  message = null,
}) => {
  return (
    <QuizModal modalVisible={modalVisible} handleModalClickAway={handleModalClickAway}>
      <ConfirmDelete
        scheme={scheme}
        handleCancelClick={handleCancelClick}
        handleConfirmClick={handleConfirmClick}
        message={message}
      />
    </QuizModal>
  );
};

export default ConfirmDeleteModal;
