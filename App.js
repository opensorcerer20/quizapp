import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { schemes } from "./lib";
import { getFileData, getRandomInt } from "./util";
import QuizScreen from "./QuizScreen";
import Toolbar from "./Toolbar";
import { FAB } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { cleanDeckSettings } from "./QuizDeck";
import { DeckList } from "./DeckList";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DATA_STORAGE_KEY = "DATA";

export default App = () => {
  //const colorScheme = useColorScheme();
  const colorScheme = "light";
  const [deckData, setDeckData] = useState([]);
  const [currState, setCurrState] = useState({currQ: null, questionBag: null});
  const [currSource, setCurrSource] = useState({mimeType: null, name: null, size: null, uri: null, deckId: null});
  const [questionData, setQuestionData] = useState([]);
  const [deckSettings, setDeckSettings] = useState(cleanDeckSettings(null, null, null));

  const scheme = colorScheme === "dark" ? styles.schemeDark : styles.schemeLight;

  const showFilePicker = questionData.length === 0 && !currState.currQ;

  // @todo bug with this... next question doesnt work as expected
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
    setCurrState({...currState, currQ: null, questionBag});
  }

  const clearQuestions = () => {
    setQuestionData([]);
    setCurrState({currQ: null, questionBag: null});
  }

  const updateDeckSettings = (pickOrder, pickMode, cardMode) => {
    setDeckSettings(cleanDeckSettings(pickOrder, pickMode, cardMode));

    // reset deck
    //if (currSource.uri) {
      setQuestionsFromFile(currSource.uri);
      fillQuestionBag();
    //}
  }

  const setQuestionsFromFile = async (uri) => {
    setQuestionData(await getFileData(uri));
  }

  const deckAdded = ({mimeType, name, size, uri}) => {
    const newDeck = {mimeType, name, size, uri};
    const deckId = getRandomInt(10000000, 99999999);
    const newDeckData = deckData;
    deckData.push({deckId,  ...newDeck});
    setDeckData(newDeckData);
    saveData();
  }

  const onDeckPress = (deckId) => {
    const selectedDeck = deckData.find(deck => deck.deckId === deckId);
    if (selectedDeck) {
      setQuestionsFromFile(selectedDeck.uri)
    } else {
      clearQuestions();
    }
  }

  const loadData = async () => {
    try {
      const value = await AsyncStorage.getItem(DATA_STORAGE_KEY);
      if (value !== null) {
        setDeckData(JSON.parse(value));
      }
    } catch (e) {
      // error reading value
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(deckData));
    } catch (e) {
      console.log('Error saving: ' + JSON.stringify(e));
    }
  }

  useEffect(() => {
    // @todo need this odd complexity?
    // @todo need the useeffect?
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
    if (currSource.uri) {
      deckAdded(currSource);
      setQuestionsFromFile(currSource.uri);
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

  useEffect(() => {
    const loadDeckData = async () => await loadData();
    if (deckData.length === 0) {
      loadDeckData();
    }
  }, []);

  console.log('state: ' + JSON.stringify({
    currState,
    currSource,
    questionData,
    deckSettings,
  }));

  const currentView = questionData.length > 0 && currState.currQ ? 'quizView' : 'homeView';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <View style={[styles.container, scheme.bg]}>
        <Toolbar style={styles.toolbarContainer} showBack={questionData.length > 0} title={"@TODO deck name goes here"} backCallback={clearQuestions} colorScheme={colorScheme} />
        { currentView === 'quizView' && (
          <QuizScreen
            currQ={currState.currQ}
            colorScheme={colorScheme}
            nextQuestion={nextQuestion}
            numLeft={currState.questionBag.length === 7 ? 0 : currState.questionBag.length}
            deckSettings={deckSettings}
            updateDeckSettings={updateDeckSettings}
          />
        )}
        { currentView === 'homeView' && (
          <>
            <DeckList data={deckData} onPress={onDeckPress} />
            {/*<View style={[styles.insideContainer, scheme.bg]}>
              <Text>Please add a question file</Text>
            </View>*/}
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
