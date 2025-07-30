import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useLocale } from "../Providers/TranslationProvider";

const ConfirmDeleteModal = ({ scheme, handleCancelClick, handleConfirmClick }) => {
  const { getLocalString } = useLocale();

  return (
    <View style={[styles.container, styles.centeredView]}>
      <View style={[styles.modalView, scheme.bgAccent3, scheme.border]}>
        <View>
          <Text style={[scheme.txt, { paddingBottom: 10 }]}>
            {getLocalString("Are you sure you want to delete this deck?")}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Pressable style={[styles.button, scheme.disabled]} onPress={handleCancelClick}>
            <Text style={[styles.textStyle, scheme.buttonTxt]}>{getLocalString("Cancel")}</Text>
          </Pressable>
          <Pressable style={[styles.button, scheme.buttonBg]} onPress={handleConfirmClick}>
            <Text style={[styles.textStyle, scheme.buttonTxt]}>{getLocalString("Confirm")}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 300,
  },
  modalView: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    maxHeight: 150,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    borderRadius: 10,
    height: Platform.select({
      ios: 30,
      android: 40,
    }),
    margin: 5,
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ConfirmDeleteModal;
