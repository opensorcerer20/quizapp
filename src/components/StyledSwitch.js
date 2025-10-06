import { Platform, Pressable, StyleSheet, Switch, View } from "react-native";

import { getScheme } from "../common/util";
import TextNormal from "./TextNormal";

export const StyledSwitch = ({ theme, txtStyle, optionValue = true, onClick, labelTxt = null }) => {
  const scheme = getScheme(theme);
  return (
    <View style={styles.container}>
      <Switch
        trackColor={{
          false: scheme.bgAccent.backgroundColor,
          true: scheme.bgAccent.backgroundColor,
        }}
        ios_backgroundColor={scheme.bgAccent.backgroundColor}
        thumbColor={!!optionValue ? scheme.txt.color : scheme.txtDisabled.color}
        onValueChange={onClick}
        value={!!optionValue}
        style={styles.switch}
      />
      {labelTxt !== null && (
        <Pressable onPress={onClick} onLongPress={onClick}>
          <TextNormal style={[txtStyle, styles.switchTxt]}>{labelTxt}</TextNormal>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 10 : 0,
  },
  switch: {
    padding: 0,
    margin: 0,
  },
  switchTxt: {
    padding: 0,
    paddingLeft: 10,
    margin: 0,
  },
});
