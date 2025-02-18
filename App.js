import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import {MyButton, schemes} from "./lib";
import { getFileData } from "./util";
import FlashCard from "./FlashCard";
import Toolbar from "./Toolbar";
import {FAB} from "react-native-paper";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

// first item in array is default setting
const deckSettings = {
  pickOrder: ['random', 'sequential'],
  pickMode: ['bag', 'continuous'],
  cardMode: ['repeat', 'once'],
};

const cleanDeckSettings = (pickOrder, pickMode, cardMode) => {
  return {
    pickOrder: deckSettings.pickOrder.includes(pickOrder) ? pickOrder : deckSettings.pickOrder[0],
    pickMode: deckSettings.pickMode.includes(pickMode) ? pickMode : deckSettings.pickMode[0],
    cardMode: deckSettings.cardMode.includes(cardMode) ? cardMode : deckSettings.cardMode[0],
  }
}

export default App = () => {
  //const colorScheme = useColorScheme();
  const colorScheme = "light";
  const [currState, setCurrState] = useState({currQ: null, questionBag: null});
  const [currSource, setCurrSource] = useState({mimeType: null, name: null, size: null, uri: null});
  const [questionData, setQuestionData] = useState([]);
  const [deckSettings, setDeckSettings] = useState(cleanDeckSettings(null, null, null));

  const scheme = colorScheme === "dark" ? styles.schemeDark : styles.schemeLight;

  const showFilePicker = questionData.length === 0 && !currState.currQ;

  const nextQuestion = () => {
    setCurrState({...currState, currQ: null});
  };

  const pickQuestionFileTxt = async () => {
    try {
      const docRes = await DocumentPicker.getDocumentAsync({
        type: "text/plain",
      });

      setCurrSource(docRes.assets[0]);

    } catch (error) {
      console.log("Error while selecting file: ", JSON.stringify(error));
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

  const updateDeckSettings = (pickOrder, pickMode, cardMode) => {
    setDeckSettings(cleanDeckSettings(pickOrder, pickMode, cardMode));
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
      setQuestionData(await getFileData(uri));
    }
    if (currSource.uri) {
      init(currSource.uri);
    }
  }, [currSource])

  // testing without file select
  //useEffect(() => {
  //  const runAsync = async () => setQuestionData(await getFileDataTest(''));
  //  runAsync();
  //}, []);

  useEffect(() => {
    if (questionData.length > 0) {
      fillQuestionBag();
    }
  }, [questionData]);

  // console.log('parent order, pick, card: ' + JSON.stringify(deckSettings));

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
    <View style={[styles.container, scheme.bg]}>
      <Toolbar style={styles.toolbarContainer} showBack={questionData.length > 0} title={"@TODO deck name goes here"} backCallback={clearQuestions} colorScheme={colorScheme} />
      { currState.currQ && (
        <FlashCard 
          currQ={currState.currQ} 
          colorScheme={colorScheme} 
          nextQuestion={nextQuestion} 
          numLeft={currState.questionBag.length === 7 ? 0 : currState.questionBag.length} 
          deckSettings={deckSettings}
          updateDeckSettings={updateDeckSettings}
        />
      )}
      { showFilePicker && (
        <>
          <View style={[styles.insideContainer, scheme.bg]}>
            <Text>Please add a question file</Text>
          </View>
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={pickQuestionFileTxt}
          />
        </>
      )}
      <StatusBar style="dark" />
    </View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    //marginTop: 50,
  },
  toolbarContainer: {
    flex: 1,
  },
  insideContainer: {
    flex: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  ...schemes
});