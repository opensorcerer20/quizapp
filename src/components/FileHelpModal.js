import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
//import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { SAFE_MARGIN, SAFE_WIDTH } from "../common/constants";
import QuizModal from "./QuizModal";

const MODAL_WIDTH = SAFE_WIDTH * 0.9;
const SAFE_MODAL_WIDTH = MODAL_WIDTH * 0.95;

const FileHelpModal = ({ showModal, setShowModal, scheme }) => {
  return (
    <QuizModal
      modalVisible={showModal}
      handleModalClickAway={() => setShowModal(false)}
      modalContainerStyle={[
        styles.modalContainer,
        {
          top: Platform.OS === "ios" ? 100 : 50,
          left: SAFE_WIDTH / 2 - MODAL_WIDTH / 2 + SAFE_MARGIN / 2,
          width: MODAL_WIDTH,
        },
        scheme.baseBg3,
        { borderColor: scheme.bgAccent3.backgroundColor },
      ]}
    >
      <View
        style={[styles.modalHeader, { width: SAFE_MODAL_WIDTH, marginHorizontal: "auto", marginTop: 5, padding: 10 }]}
      >
        <Text style={[styles.modalTitle, scheme.txt, { flex: 11 }]}>File Help</Text>
        <Pressable onPress={() => setShowModal(false)}>
          <FontAwesome6
            name="square-xmark"
            size={24}
            color={scheme.txt.color}
            style={{ textAlign: "right", flex: 1 }}
          />
        </Pressable>
      </View>
      <View style={{ flexDirection: "column" }}>
        <View style={{ flex: 11 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[scheme.txt, { flex: 1, marginLeft: 10, marginRight: 5 }]}>&lt;</Text>
            <View style={{ flex: 10 }}>
              <Text style={scheme.txt}>
                four score and seven years ago our forefathers brought forth upon this continent a new nation conceived
                in liberty and dedicated the proposition that all men are created equal
              </Text>
              {/*
          <View style={styles.helpItem}>
        <Text style={[styles.helpParaIcon, scheme.txt]}>
          <Entypo name="text" size={24} color={scheme.txt.color} />
        </Text>
        <Text style={[styles.helpPara, scheme.txt]}>
          TXT files should alternate between question (odd lines) and answers (even lines)
        </Text>
      </View>
      <View style={styles.helpItem}>
        <Text style={[styles.helpParaIcon, scheme.txt]}>
          <MaterialCommunityIcons name="table" size={24} color={scheme.txt.color} />
        </Text>
        <Text style={[styles.helpPara, scheme.txt]}>
          CSV files should be saved as CSV files, with questions in column 1 or "A" and answers in column 2 or "B"
        </Text>
      </View>
          */}
            </View>
            <Text style={[scheme.txt, { flex: 1, marginLeft: 5, marginRight: 10, textAlign: "right" }]}>&gt;</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: "center", marginVertical: 10 }}>
          <View style={{ flexDirection: "row", width: 100, alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <MaterialCommunityIcons name="circle" size={8} color={scheme.txt.color} />
            </View>
            <View style={{ flex: 1 }}>
              <MaterialCommunityIcons name="circle-outline" size={8} color={scheme.txt.color} />
            </View>
            <View style={{ flex: 1 }}>
              <MaterialCommunityIcons name="circle-outline" size={8} color={scheme.txt.color} />
            </View>
            <View style={{ flex: 1 }}>
              <MaterialCommunityIcons name="circle-outline" size={8} color={scheme.txt.color} />
            </View>
          </View>
        </View>
      </View>
    </QuizModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "flex-start", // removing this removes left padding for helpmenu
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    width: SAFE_MODAL_WIDTH,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 24,
  },
});

export default FileHelpModal;
