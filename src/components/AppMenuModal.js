import { Platform, StyleSheet } from "react-native";

import AppMenu from "./AppMenu";
import QuizModal from "./QuizModal";

const AppMenuModal = ({ showMenu, setShowMenu, scheme }) => {
  return (
    <QuizModal
      modalVisible={showMenu}
      handleModalClickAway={() => setShowMenu(false)}
      modalContainerStyle={[
        styles.menuModal,
        {
          top: Platform.OS === "ios" ? 90 : 40,
          left: 20,
          width: "auto",
        },
        scheme.baseBg,
        { borderColor: scheme.bgAccent2.backgroundColor, borderWidth: 1 },
      ]}
    >
      <AppMenu scheme={scheme} />
    </QuizModal>
  );
};

const styles = StyleSheet.create({
  menuModal: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
  },
});

export default AppMenuModal;
