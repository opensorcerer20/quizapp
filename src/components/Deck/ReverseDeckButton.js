import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

export const ReverseDeckButton = ({ txtStyle, isReversed, onClick }) => {
  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Switch
          trackColor={{
            false: "#767577",
            true: "#81b0ff",
          }}
          thumbColor={isReversed ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={onClick}
          value={isReversed}
          style={styles.switch}
        />

        <Pressable onPress={onClick} onLongPress={onClick} style={styles.switchTextPress}>
          <Text style={txtStyle}>Reverse Q & A</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { margin: "auto" },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  switch: { width: 50, marginHorizontal: 10 },
  switchTextPress: {
    width: 150,
  },
});
