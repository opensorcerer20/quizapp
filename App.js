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
  const [currState, setCurrState] = useState({currQ: null, questionBag: null});

  const nextQuestion = () => {
    setShowAnswer(false);
    setCurrState({...currState, currQ: null});
  };

  const getData = async () => {
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
        setCurrState({...currState, questionBag: myJson});
      });
  }

  useEffect(() => {
    if (currState.questionBag) {
      if (currState.questionBag.length > 0) {
        if (!currState.currQ) {
          // load next question
          const newQuestionBag = currState.questionBag;
          setCurrState({currQ: newQuestionBag.pop(), questionBag: newQuestionBag});
        }
      } else {
        // out of questions, reset
        const reset = async () => {
          await getData();
        }
        reset();
      }
    }
  }, [currState]);

  useEffect(() => {
    const init = async () => {
      await getData();
    }
    init();
  }, [])

  //console.log('currstate ' + JSON.stringify(currState));

  return (
    <View style={styles.container}>
      {currState.currQ ? (
        <>
        <View style={styles.topHalf}>
          <View><Text>{currState.currQ.q}</Text></View>
          <MyButton onPress={() => setShowAnswer(true)} buttonText="Show Answer"></MyButton>
        </View>
        {showAnswer ? (
          <View style={styles.bottomHalf}>
            <View><Text>{currState.currQ.a}</Text></View>
            <MyButton onPress={nextQuestion} buttonText="Next Question"></MyButton>
          </View>
        ) : (<View style={styles.bottomHalf}></View>)}
      </>
      ) : (
        <View><Text>Loading...</Text></View>
      )}
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