import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { getScheme } from "../../common/util";

export const StyledSwitch = ({ theme, txtStyle, optionValue = true, onClick, labelTxt }) => {
  const scheme = getScheme(theme);
  return (
    <View style={styles.container}>
      <Switch
        trackColor={{
          false: scheme.bgAccent3.backgroundColor,
          true: scheme.bgAccent3.backgroundColor,
        }}
        ios_backgroundColor={scheme.bgAccent3.backgroundColor}
        thumbColor={!!optionValue ? scheme.txt.color : scheme.disabled.backgroundColor}
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
