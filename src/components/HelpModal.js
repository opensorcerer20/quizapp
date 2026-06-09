import {
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";

import { globalStyles } from "../common/lib";
import HelpContent, { MODAL_WIDTH } from "./HelpContent";
import QuizModal from "./QuizModal";

const HelpModal = ({ showModal, setShowModal, scheme, helpType }) => {
  return (
    <QuizModal
      modalVisible={showModal}
      handleModalClickAway={() => setShowModal(false)}
      modalContainerStyle={[
        styles.helpModal,
        {
          top: Platform.OS === "android" ? 50 : 100,
          left: Dimensions.get("window").width / 2 - MODAL_WIDTH / 2,
          width: MODAL_WIDTH,
        },
        scheme.modalBg,
        { borderColor: scheme.bgAccent.backgroundColor, borderWidth: 1 },
      ]}
    >
      <HelpContent scheme={scheme} helpType={helpType} setShowModal={setShowModal} />
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

export default HelpModal;
