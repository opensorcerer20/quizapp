import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
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
  const [currQ, setCurrQ] = useState(null);
  const [questionBag, setQuestionBag] = useState([]);
  const hideAnswer = !showAnswer;

  const nextQuestion = () => {
    // if bag empty
      // refill bag
    setShowAnswer(false); // hide answer before next question loaded
    // setCurrQ(questionBag.pop())
    // setQuestionBag(questionBag)
  };

  const getData = () => {
    fetch(
      'assets/questions.json',
      {
        headers : {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )
      .then((response) => {
        console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
      });
  }

  useEffect(()=>{
    getData()
  }, [])

  /*
  on init
    - no question
    - load json
    - load first question
    - now show question
  */

  return (
    <View style={styles.container}>
      <View style={styles.topHalf}>
        <View><Text>text 1</Text></View>
        <View><Text>text 2</Text></View>
        <MyButton onPress={() => setShowAnswer(true)} buttonText="Show Answer"></MyButton>
      </View>
      {showAnswer && (
        <View style={styles.bottomHalf}>
          <View><Text>text 3</Text></View>
          <View><Text>text 4</Text></View>
          <MyButton onPress={nextQuestion} buttonText="Next Question"></MyButton>
        </View>
      )}
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