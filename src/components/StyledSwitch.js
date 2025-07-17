import { Platform, Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { getBgScheme, getScheme } from "../common/util";

export const StyledSwitch = ({ theme, txtStyle, optionValue = true, onClick, labelTxt = null }) => {
  const scheme = getScheme(theme);
  const schemeBg = getBgScheme(theme);
  return (
    <View style={styles.container}>
      <Switch
        trackColor={{
          false: schemeBg.bgAccent3,
          true: schemeBg.bgAccent3,
        }}
        ios_backgroundColor={schemeBg.bgAccent3}
        thumbColor={!!optionValue ? scheme.txt.color : schemeBg.disabled}
        onValueChange={onClick}
        value={!!optionValue}
        style={styles.switch}
      />
      {labelTxt !== null && (
        <Pressable onPress={onClick} onLongPress={onClick}>
          <Text style={[txtStyle, styles.switchTxt]}>{labelTxt}</Text>
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
