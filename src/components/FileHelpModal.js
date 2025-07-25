import { useState } from "react";

import { Image } from "expo-image";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
//import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { SAFE_MARGIN, SAFE_WIDTH } from "../common/constants";
import QuizModal from "./QuizModal";

const MODAL_WIDTH = SAFE_WIDTH * 0.9;
const SAFE_MODAL_WIDTH = MODAL_WIDTH * 0.95;

const FileHelpModal = ({ showModal, setShowModal, scheme }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    <View style={{ flexDirection: "column" }}>
      <MaterialCommunityIcons
        style={{ flex: 1, marginHorizontal: "auto", marginBottom: 10 }}
        name="text"
        size={24}
        color={scheme.txt.color}
      />
      <Text style={[scheme.txt, { flex: 1 }]}>
        TXT files should alternate between question (odd lines) and answers (even lines)
      </Text>
      <Image
        source={require("../../assets/txt_example.png")}
        style={{ flex: 1, width: 430, height: 144, alignSelf: "center", transform: [{ scale: 0.55 }] }}
      />
    </View>,
    <View style={{ flexDirection: "column" }}>
      <MaterialCommunityIcons
        style={{ flex: 1, marginHorizontal: "auto", marginBottom: 10 }}
        name="table"
        size={24}
        color={scheme.txt.color}
      />
      <Text style={[scheme.txt, { flex: 1 }]}>
        CSV files should be saved as CSV files, with questions in column 1 and answers in column 2
      </Text>
      <Image
        source={require("../../assets/csv_example.png")}
        style={{ flex: 1, width: 376, height: 171, alignSelf: "center", transform: [{ scale: 0.6 }] }}
      />
    </View>,
  ];

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
      <View style={{ flexDirection: "column" }}>
        <View
          style={[
            styles.modalHeader,
            { flex: 2, width: SAFE_MODAL_WIDTH + 10, marginHorizontal: "auto", marginTop: 5, padding: 10 },
          ]}
        >
          <Text style={[styles.modalTitle, scheme.txt, { flex: 11, paddingLeft: 5 }]}>File Help</Text>
          <Pressable onPress={() => setShowModal(false)}>
            <FontAwesome6
              name="square-xmark"
              size={24}
              color={scheme.txt.color}
              style={{ textAlign: "right", flex: 1 }}
            />
          </Pressable>
        </View>

        <View style={{ flex: 9 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              style={{ flex: 1, paddingLeft: 5 }}
              onPress={() => (currentPage > 0 ? setCurrentPage((currentPage + pages.length - 1) % pages.length) : null)}
            >
              {currentPage > 0 && <MaterialCommunityIcons name="chevron-left" size={36} color={scheme.txt.color} />}
            </Pressable>
            <View
              style={{ flex: 10, width: SAFE_MODAL_WIDTH - 40, height: 320, overflow: "scroll", paddingHorizontal: 20 }}
            >
              {pages[currentPage]}
            </View>
            <Pressable
              style={{ flex: 1, paddingRight: 5, alignItems: "flex-end" }}
              onPress={() =>
                currentPage < pages.length - 1 ? setCurrentPage((currentPage + pages.length + 1) % pages.length) : null
              }
            >
              {currentPage < pages.length - 1 && (
                <MaterialCommunityIcons name="chevron-right" size={36} color={scheme.txt.color} />
              )}
            </Pressable>
          </View>
        </View>
        <View style={{ flex: 1, width: 50, alignSelf: "center", marginVertical: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {pages.map((_, idx) => (
              <View key={idx} style={{ flex: 1, paddingHorizontal: 2 }}>
                <MaterialCommunityIcons
                  name={idx === currentPage ? "circle" : "circle-outline"}
                  size={8}
                  color={scheme.txt.color}
                />
              </View>
            ))}
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
