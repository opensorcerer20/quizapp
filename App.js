import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import {MyButton, schemes} from "./lib";
import FlashCard from "./FlashCard";
import Toolbar from "./Toolbar";

const makeQuestionObject = (question, answer) => {
  return {
    q: question,
    a: answer,
  };
}

const makeQuestionData = (text) => {
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
    questions.push(makeQuestionObject(quizData[i], quizData[i + 1]));
  }

  return questions;
}

export default App = () => {
  //const colorScheme = useColorScheme();
  const colorScheme = "light";
  const [currState, setCurrState] = useState({currQ: null, questionBag: null});
  const [currSource, setCurrSource] = useState({mimeType: null, name: null, size: null, uri: null});
  const [questionData, setQuestionData] = useState([]);

  const nextQuestion = () => {
    setCurrState({...currState, currQ: null});
  };

  const getFileDataTest = async (fileUri) => {
    console.log('getfiledata');
    const text = `question 1
answer 1
question 2
answer 2
`;
    questions = makeQuestionData(text);

    setQuestionData(questions);
  }

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
        questions = makeQuestionData(text);

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
    setCurrState({currQ: null, questionBag: null});
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

  // testing without file select
  //useEffect(() => {
  //  const runAsync = async () => await getFileDataTest('');
  //  runAsync();
  //}, []);

  useEffect(() => {
    if (questionData.length > 0) {
      fillQuestionBag();
    }
  }, [questionData]);

  const scheme = colorScheme === "dark" ? styles.schemeDark : styles.schemeLight;

  const showFilePicker = questionData.length === 0 && !currState.currQ;

  return (
    <View style={[styles.container, scheme.bg]}>
      <Toolbar style={styles.toolbarContainer} showBack={questionData.length > 0} backCallback={clearQuestions} colorScheme={colorScheme} />
      { currState.currQ && (
        <FlashCard currQ={currState.currQ} colorScheme={colorScheme} nextQuestion={nextQuestion} />
      )}
      { showFilePicker && (
          <View style={[styles.insideContainer, scheme.bg]}>
            <MyButton onPress={pickQuestionFile} buttonText="Pick Question File" />
          </View>
      )}
      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 50,
  },
  toolbarContainer: {
    flex: 1,
  },
  insideContainer: {
    flex: 10,
  },
  ...schemes
});