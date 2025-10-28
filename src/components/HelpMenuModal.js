import { Platform, StyleSheet } from "react-native";

import { SAFE_MARGIN, SAFE_WIDTH } from "../common/constants";
import { globalStyles } from "../common/lib";
import HelpMenu, { HELP_MODAL_WIDTH } from "./HelpMenu";
import QuizModal from "./QuizModal";

const HelpMenuModal = ({ showModal, setShowModal, scheme, helpType }) => {
  return (
    <QuizModal
      modalVisible={showModal}
      handleModalClickAway={() => setShowModal(false)}
      modalContainerStyle={[
        styles.helpModal,
        {
          top: Platform.OS === "ios" ? 100 : 50,
          left: SAFE_WIDTH / 2 - HELP_MODAL_WIDTH / 2 + SAFE_MARGIN / 2,
          width: HELP_MODAL_WIDTH,
        },
        scheme.modalBg,
        { borderColor: scheme.bgAccent3.backgroundColor, borderWidth: 1 },
      ]}
    >
      <HelpMenu scheme={scheme} helpType={helpType} setShowModal={setShowModal} />
    </QuizModal>
  );
};

const styles = StyleSheet.create({
  helpModal: {
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

export default HelpMenuModal;
