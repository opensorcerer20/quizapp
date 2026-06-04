import {
  Dimensions,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

//import Feather from "@expo/vector-icons/Feather";
import { SCREEN_WIDTH } from "../common/constants";
import { globalStyles } from "../common/lib";
import { useLocale } from "./Providers/TranslationProvider";
import QuizModal from "./QuizModal";
import TextNormal from "./TextNormal";

const AppMenuModal = ({ showModal, setShowModal, onClickHelp, onClickNew, onClickTutorial, scheme }) => {
  const { getLocalString } = useLocale();

  const openExternalLink = async (url) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <QuizModal
      modalVisible={showModal}
      handleModalClickAway={() => setShowModal(false)}
      modalContainerStyle={[
        styles.menuModal,
        {
          top: 60,
          left: Dimensions.get("window").width / 2 - SCREEN_WIDTH / 2 + 20,
          width: "auto",
        },
        scheme.modalBg,
        { borderColor: scheme.txtForBg.color, borderWidth: 1 },
      ]}
    >
      <Pressable onPress={onClickNew}>
        <View style={[styles.menuItem, { borderColor: scheme.txt.color }]}>
          <TextNormal style={[scheme.txt, { fontSize: 16 }]}>{getLocalString("Make new deck")}</TextNormal>
        </View>
      </Pressable>
      <Pressable onPress={onClickHelp}>
        <View style={[styles.menuItem, { borderColor: scheme.txt.color }]}>
          <TextNormal style={[scheme.txt, { fontSize: 16 }]}>{getLocalString("Deck file help")}</TextNormal>
        </View>
      </Pressable>
      <Pressable onPress={onClickTutorial}>
        <View style={[styles.menuItem, { borderColor: scheme.txt.color }]}>
          <TextNormal style={[scheme.txt, { fontSize: 16 }]}>{getLocalString("Show Tutorial")}</TextNormal>
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
