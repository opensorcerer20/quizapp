import { Image, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";

import { SAFE_WIDTH } from "../common/constants";
import QuizModal from "./QuizModal";

const TutorialModal = ({ showModal, setShowModal }) => {
  const { width } = useWindowDimensions();
  return (
    <QuizModal
      modalVisible={showModal}
      handleModalClickAway={() => setShowModal(false)}
      modalContainerStyle={[
        {
          marginHorizontal: "auto",
          width: width,
          height: 300,
          backgroundColor: "rgba(12, 12, 12, 0.6)",
        },
      ]}
    >
      <Pressable onPress={() => setShowModal(false)}>
        <View>
          <Image source={require("../../assets/card_tutorial.png")} width={SAFE_WIDTH} />
        </View>
      </Pressable>
    </QuizModal>
  );
};

const styles = StyleSheet.create({});

export default TutorialModal;
