import { Pressable, StyleSheet, Text, View } from "react-native";

import { SAFE_WIDTH } from "../common/constants";
import { globalStyles } from "../common/lib";

const CancelSubmit = ({
  scheme,
  onBackClick,
  handleSubmit,
  cancelLabel = "Cancel",
  submitLabel = "Submit",
  submitDisabled = false,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        onPress={onBackClick}
        onLongPress={onBackClick}
        style={[globalStyles.button, scheme.disabled, styles.buttonStyle]}
      >
        <Text style={[scheme.buttonTxt, { fontSize: 16, fontWeight: "bold" }]}>{cancelLabel}</Text>
      </Pressable>
      <Pressable
        onPress={submitDisabled ? () => {} : handleSubmit}
        onLongPress={submitDisabled ? () => {} : handleSubmit}
        style={[globalStyles.button, scheme.buttonBg, submitDisabled ? scheme.disabled : {}, styles.buttonStyle]}
      >
        <Text style={[scheme.buttonTxt, { fontSize: 16, fontWeight: "bold" }]}>{submitLabel}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: SAFE_WIDTH * 0.9,
    marginTop: 20,
  },
  buttonStyle: {
    alignItems: "center",
  },
});

export default CancelSubmit;
