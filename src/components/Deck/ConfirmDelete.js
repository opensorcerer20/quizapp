import { Platform, Pressable, StyleSheet, View } from "react-native";

import { useLocale } from "../Providers/TranslationProvider";
import TextNormal from "../TextNormal";

const ConfirmDelete = ({ scheme, handleCancelClick, handleConfirmClick, message = null }) => {
  const { getLocalString } = useLocale();

  return (
    <View style={[styles.container, styles.centeredView]}>
      <View style={[styles.modalView, scheme.bgAccent3, scheme.border]}>
        <View>
          <TextNormal style={[scheme.txt, { paddingBottom: 10 }]}>
            {message ? message : getLocalString("Are you sure you want to delete this deck?")}
          </TextNormal>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Pressable style={[styles.button, scheme.bgDisabled]} onPress={handleCancelClick}>
            <TextNormal style={[styles.textStyle, scheme.buttonTxt]}>{getLocalString("Cancel")}</TextNormal>
          </Pressable>
          <Pressable style={[styles.button, scheme.buttonBg]} onPress={handleConfirmClick}>
            <TextNormal style={[styles.textStyle, scheme.buttonTxt]}>{getLocalString("Confirm")}</TextNormal>
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

export default ConfirmDelete;
