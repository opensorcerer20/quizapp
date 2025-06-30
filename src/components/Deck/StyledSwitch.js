import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { getBgScheme, getScheme } from "../../common/util";

export const StyledSwitch = ({ theme, txtStyle, optionValue = true, onClick, labelTxt }) => {
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
      />

      <Pressable onPress={onClick} onLongPress={onClick}>
        <Text style={[txtStyle, { paddingLeft: 10 }]}>{labelTxt}</Text>
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
