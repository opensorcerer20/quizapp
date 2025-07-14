import { Platform, StyleSheet } from "react-native";

import { SAFE_MARGIN, SAFE_WIDTH } from "../common/constants";
import HelpMenu, { HELP_MODAL_WIDTH } from "./HelpMenu";
import QuizModal from "./QuizModal";

const HelpMenuModal = ({ showHelp, setShowHelp, scheme, helpType }) => {
  return (
    <QuizModal
      modalVisible={showHelp}
      handleModalClickAway={() => setShowHelp(false)}
      modalContainerStyle={[
        styles.helpModal,
        {
          top: Platform.OS === "ios" ? 100 : 50,
          left: SAFE_WIDTH / 2 - HELP_MODAL_WIDTH / 2 + SAFE_MARGIN / 2,
          width: HELP_MODAL_WIDTH,
        },
        scheme.baseBg,
        { borderColor: scheme.bgAccent3.backgroundColor, borderWidth: 1 },
      ]}
    >
      <HelpMenu scheme={scheme} helpType={helpType} setShowHelp={setShowHelp} />
    </QuizModal>
  );
};

const styles = StyleSheet.create({
  helpModal: {
    position: "absolute",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "flex-start", // removing this removes left padding for helpmenu
    borderRadius: 10,
  },
});

export default HelpMenuModal;
