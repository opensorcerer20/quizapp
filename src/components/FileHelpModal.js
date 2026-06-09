import { useState } from "react";

import { Dimensions, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { SAFE_WIDTH } from "../common/constants";
import { globalStyles } from "../common/lib";
import { useLocale } from "./Providers/TranslationProvider";
import QuizModal from "./QuizModal";
import TextNormal from "./TextNormal";

const MODAL_WIDTH = SAFE_WIDTH - 20;
const SAFE_MODAL_WIDTH = MODAL_WIDTH * 0.95;

const FileHelpModal = ({ showModal, setShowModal, scheme }) => {
  const { getLocalString } = useLocale();
  const [currentPage, setCurrentPage] = useState(0);

  const csvHelp = [
    [getLocalString("Question") + " 1", getLocalString("Answer") + " 1", "(" + getLocalString("ignored") + ")"],
    [getLocalString("Question") + " 2", getLocalString("Answer") + " 2", ""],
    ["What is 2 + 2?", "4", ""],
  ];

  const pages = [
    <View style={{ flexDirection: "column" }}>
      <MaterialCommunityIcons
        style={{ flex: 1, marginHorizontal: "auto", marginBottom: 10 }}
        name="text"
        size={24}
        color={scheme.txt.color}
      />
      <TextNormal style={[scheme.txt, { flex: 1, fontSize: 20 }]}>
        {getLocalString("TXT files should alternate between question (odd lines) and answers (even lines)")}
      </TextNormal>

      <TextInput
        editable={false}
        multiline={true}
        numberOfLines={4}
        value={getLocalString("Question") + " 1\n" + getLocalString("Answer") + " 1\nWhat is 2 + 2?\nfour"}
        style={{
          borderWidth: 1,
          borderColor: scheme.txt.color,
          padding: 8,
          borderRadius: 4,
          marginTop: 8,
          color: scheme.txtDisabled.color,
          fontSize: 16,
          height: 128,
          textAlignVertical: "top",
        }}
      />
    </View>,
    <View style={{ flexDirection: "column" }}>
      <MaterialCommunityIcons
        style={{ flex: 1, marginHorizontal: "auto", marginBottom: 10 }}
        name="table"
        size={24}
        color={scheme.txt.color}
      />
      <TextNormal style={[scheme.txt, { flex: 1, fontSize: 20 }]}>
        {getLocalString("CSV files should be saved as CSV files, with questions in column 1 and answers in column 2")}
      </TextNormal>
      <View style={{ marginTop: 12, width: "100%" }}>
        {csvHelp.map((row, rowIdx) => (
          <View key={rowIdx} style={{ flexDirection: "row" }}>
            {row.map((value, colIdx) => (
              <View
                key={colIdx}
                style={{
                  flex: 1,
                  height: 36,
                  maxWidth: 80,
                  borderWidth: 1,
                  padding: 4,
                  borderColor: scheme.txt.color,
                  justifyContent: "center",
                  alignItems: "left",
                }}
              >
                <TextNormal style={[scheme.txt, { fontSize: 12 }]}>{value}</TextNormal>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>,
  ];

  return (
    <QuizModal
      modalVisible={showModal}
      handleModalClickAway={() => setShowModal(false)}
      modalContainerStyle={[
        styles.modalContainer,
        {
          top: Platform.OS === "android" ? 50 : 100,
          left: Dimensions.get("window").width / 2 - MODAL_WIDTH / 2,
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
          <TextNormal style={[styles.modalTitle, scheme.txt, { flex: 11, paddingLeft: 5 }]}>
            {getLocalString("File Help")}
          </TextNormal>
          <Pressable onPress={() => setShowModal(false)}>
            <FontAwesome6
              name="square-xmark"
              size={24}
              color={scheme.txt.color}
              style={{ textAlign: "right", flex: 1 }}
            />
          </Pressable>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", height: 300 }}>
          <Pressable onPress={() => (currentPage > 0 ? setCurrentPage(currentPage - 1) : null)} style={{ width: 36 }}>
            {currentPage > 0 && (
              <MaterialCommunityIcons name="chevron-left" size={36} color={scheme.txt.color} testID="next-page-icon" />
            )}
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text>{pages[currentPage]}</Text>
          </View>

          <Pressable
            onPress={() => (currentPage < pages.length - 1 ? setCurrentPage(currentPage + 1) : null)}
            style={{ width: 36 }}
          >
            {currentPage < pages.length - 1 && (
              <MaterialCommunityIcons name="chevron-right" size={36} color={scheme.txt.color} testID="next-page-icon" />
            )}
          </Pressable>
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
