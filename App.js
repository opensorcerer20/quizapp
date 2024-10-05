import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable } from "react-native";
import { StyleSheet, Text, View } from "react-native";

const MyButton = ({buttonText, onPress}) => {
  const noop = () => {};
  return (
    <Pressable style={styles.button} onPress={onPress ?? noop}>
      <Text style={styles.buttonText}>{buttonText ?? "Next"}</Text>
    </Pressable>
  );
};

export default App = () => {
  const [showAnswer, setShowAnswer] = useState(false);
  const hideAnswer = !showAnswer;
  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <View><Text>text 1</Text></View>
        <View><Text>text 2</Text></View>
        <MyButton onPress={() => setShowAnswer(true)} buttonText="Show Answer"></MyButton>
      </View>
      {showAnswer && (<View style={styles.bottomHalf}>
      <View><Text>text 3</Text></View>
      <View><Text>text 4</Text></View>
      <MyButton onPress={() => setShowAnswer(false)} buttonText="Next Question"></MyButton>
      </View>)}
      {hideAnswer && (<View style={styles.bottomHalf}></View>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHalf: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: "#aaaaaa",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "darkblue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
