import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

const MyButton = ({buttonText, onPress}) => {
  const noop = () => {};
  return (
    <Pressable style={styles.button} onPress={onPress ?? noop}>
      <Text style={styles.buttonText}>{buttonText ?? "Next"}</Text>
    </Pressable>
  );
};

const MyButton2 = (props) => {
  const noop = () => {};
  return (
    <Pressable onPress={props.onPress ?? noop}>
      {props.children ?? null}
    </Pressable>
  );
};

export default App = () => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [currState, setCurrState] = useState({currQ: null, questionBag: null});
  const [currSource, setCurrSource] = useState({mimeType: null, name: null, size: null, uri: null});
  const [questionData, setQuestionData] = useState([]);

  const nextQuestion = () => {
    setShowAnswer(false);
    setCurrState({...currState, currQ: null});
  };

  const getFileData = async (fileUri) => {
    fetch(
      fileUri,
      {
        headers : {
          'Content-Type': 'text/plain',
          'Accept': 'text/plain'
        }
      }
    )
      .then((response) => {
        return response.text();
      })
      .then(function(text) {
        // clean input that could have \r\n
        var quizData = text.split("\n");
        quizData = quizData.map(datum => datum.trim()).filter(datum => datum.length > 0);

        // assume even number with question/answer pairs
        if (quizData.length % 2 === 1) {
          quizData.pop();
        }
        
        // make {q,a} object array
        var questions = [];
        for (var i = 0; i < quizData.length; i += 2) {
          questions.push({q: quizData[i], a: quizData[i + 1]});
        }

        setQuestionData(questions);
      });
  }

  const pickQuestionFile = async () => {
    try {
      const docRes = await DocumentPicker.getDocumentAsync({
        type: "text/plain",
      });

      setCurrSource(docRes.assets[0]);

    } catch (error) {
      console.log("Error while selecting file: ", error);
    }
  };

  const fillQuestionBag = () => {
    // randomize questions
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#46545530
    const questionBag = questionData
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
    setCurrState({...currState, questionBag});
  }

  const clearQuestions = () => {
    setQuestionData([]);
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
        fillQuestionBag();
      }
    }
  }, [currState]);

  useEffect(() => {
    const init = async (uri) => {
      await getFileData(uri);
    }
    if (currSource.uri) {
      init(currSource.uri);
    }
  }, [currSource])

  useEffect(() => {
    if (questionData.length > 0) {
      fillQuestionBag();
    }
  }, [questionData]);

  return (
    <View style={styles.container}>
      {questionData.length > 0 ? (
        <>
          <View style={[styles.insideContainer, {flexDirection: "row"}]}>
            <View style={{flex: 1}}>
              <MyButton2 onPress={() => clearQuestions()}>
                <Ionicons name="arrow-back-circle-outline" size={32} color="black"></Ionicons>
              </MyButton2>
            </View>
            <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
              <MyButton2 onPress={() => console.log('gear press')}>
                <Ionicons name="settings-outline" size={32} color="black"></Ionicons>
              </MyButton2>
            </View>
          </View>
          { currState.currQ && (
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
              ) : (
                <View style={styles.bottomHalf}></View>
              )}
            </>
          )}
        </>
      ) : (
        <>
            <View><Text>Loading...</Text></View>
            <View style={styles.insideContainer}>
              <MyButton onPress={pickQuestionFile} buttonText="Pick Question File" />
            </View>
        </>
      )}
      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  insideContainer: {
    flex: 1,
    flexBasis: "auto",
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