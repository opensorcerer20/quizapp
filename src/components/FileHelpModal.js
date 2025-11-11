import { useState } from "react";

import { Platform, Pressable, StyleSheet, View } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { SAFE_MARGIN, SAFE_WIDTH } from "../common/constants";
import { globalStyles } from "../common/lib";
import { useLocale } from "./Providers/TranslationProvider";
import QuizModal from "./QuizModal";
import TextNormal from "./TextNormal";

const MODAL_WIDTH = SAFE_WIDTH * 0.9;
const SAFE_MODAL_WIDTH = MODAL_WIDTH * 0.95;

const FileHelpModal = ({ showModal, setShowModal, scheme }) => {
  const { getLocalString } = useLocale();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    <View style={{ flexDirection: "column" }}>
      <MaterialCommunityIcons
        style={{ flex: 1, marginHorizontal: "auto", marginBottom: 10 }}
        name="text"
        size={24}
        color={scheme.txt.color}
      />
      <TextNormal style={[scheme.txt, { flex: 1 }]}>
        {getLocalString("TXT files should alternate between question (odd lines) and answers (even lines)")}
      </TextNormal>
      {/* @todo disabled text box with text */}
    </View>,
    <View style={{ flexDirection: "column" }}>
      <MaterialCommunityIcons
        style={{ flex: 1, marginHorizontal: "auto", marginBottom: 10 }}
        name="table"
        size={24}
        color={scheme.txt.color}
      />
      <TextNormal style={[scheme.txt, { flex: 1 }]}>
        {getLocalString("CSV files should be saved as CSV files, with questions in column 1 and answers in column 2")}
      </TextNormal>
      {/* @todo grid like spreadsheet */}
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
        scheme.modalBg,
        { borderColor: scheme.bgAccent.backgroundColor },
      ]}
    >
      <View style={{ flexDirection: "column" }}>
        <View
          style={[
            styles.modalHeader,
            { flex: 2, width: SAFE_MODAL_WIDTH + 10, marginHorizontal: "auto", marginTop: 5, padding: 10 },
          ]}
        >
          <TextNormal style={[styles.modalTitle, scheme.txt, { flex: 11, paddingLeft: 5 }]}>File Help</TextNormal>
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
    shadowColor: globalStyles.bgBlack.backgroundColor,
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
