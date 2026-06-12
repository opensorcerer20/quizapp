import { Dimensions, Platform, StyleSheet } from "react-native";

import InstallContent from "../app/InstallContent";
import { SAFE_WIDTH } from "../common/constants";
import { globalStyles } from "../common/lib";
import QuizModal from "./QuizModal";

export const MODAL_WIDTH = Math.min(SAFE_WIDTH, 300);

const InstallModal = ({ showModal, setShowModal, scheme }) => {
  return (
    <QuizModal
      modalVisible={showModal}
      handleModalClickAway={() => setShowModal(false)}
      modalContainerStyle={[
        styles.modal,
        {
          top: Platform.OS === "android" ? 50 : 100,
          left: Dimensions.get("window").width / 2 - MODAL_WIDTH / 2,
          width: MODAL_WIDTH,
        },
        scheme.modalBg,
        { borderColor: scheme.bgAccent.backgroundColor, borderWidth: 1 },
      ]}
    >
      <InstallContent scheme={scheme} setShowModal={setShowModal} />
    </QuizModal>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    borderRadius: 5,
    shadowColor: globalStyles.bgBlack.backgroundColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "flex-start", // removing this removes left padding for helpmenu
    borderRadius: 10,
  },
});

export default InstallModal;
