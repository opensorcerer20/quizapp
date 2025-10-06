import { Platform, Pressable, StyleSheet, View } from "react-native";

import { globalStyles } from "../common/lib";
import QuizModal from "./QuizModal";
import TextNormal from "./TextNormal";

const AppMenuModal = ({ showModal, setShowModal, onClickHelp, onClickNew, scheme }) => {
  return (
    <QuizModal
      modalVisible={showModal}
      handleModalClickAway={() => setShowModal(false)}
      modalContainerStyle={[
        styles.menuModal,
        {
          top: Platform.OS === "ios" ? 90 : 40,
          left: 20,
          width: "auto",
        },
        scheme.bg,
        { borderColor: scheme.txtForBg.color, borderWidth: 1 },
      ]}
    >
      <Pressable onPress={onClickNew}>
        <View style={[styles.menuItem, { borderColor: scheme.txt.color }]}>
          <TextNormal style={[scheme.txt, { fontSize: 16 }]}>Make new deck</TextNormal>
        </View>
      </Pressable>
      <Pressable onPress={onClickHelp}>
        <View style={[styles.menuItem, { borderColor: scheme.txt.color }]}>
          <TextNormal style={[scheme.txt, { fontSize: 16 }]}>Deck file help</TextNormal>
        </View>
      </Pressable>
    </QuizModal>
  );
};

const styles = StyleSheet.create({
  menuModal: {
    position: "absolute",
    shadowColor: globalStyles.bgBlack.backgroundColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
  },
  menuItem: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 15 : 10,
  },
});

export default AppMenuModal;
