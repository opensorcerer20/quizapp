import { Platform, Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { getBgScheme, getScheme } from "../../common/util";

export const StyledSwitch = ({ theme, txtStyle, optionValue = true, onClick, labelTxt }) => {
  const scheme = getScheme(theme);
  const schemeBg = getBgScheme(theme);
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: Platform.OS === "ios" ? 10 : 0,
      }}
    >
      <Switch
        trackColor={{
          false: schemeBg.bgAccent3,
          true: schemeBg.bgAccent3,
        }}
        ios_backgroundColor={schemeBg.bgAccent3}
        thumbColor={!!optionValue ? scheme.txt.color : schemeBg.disabled}
        onValueChange={onClick}
        value={!!optionValue}
        style={{ padding: 0, margin: 0 }}
      />
      <Pressable onPress={onClick} onLongPress={onClick}>
        <Text style={[txtStyle, { padding: 0, paddingLeft: 10, margin: 0 }]}>{labelTxt}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    margin: "auto",
  },
});
