import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { getScheme } from "../../common/util";

export const StyledSwitch = ({ theme, txtStyle, optionValue = true, onClick, labelTxt }) => {
  const scheme = getScheme(theme);
  return (
    <View style={styles.container}>
      <Switch
        trackColor={{
          false: scheme.bgPrimary,
          true: scheme.bgPrimary,
        }}
        thumbColor={!!optionValue ? scheme.bgAccent1 : scheme.disabled}
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
