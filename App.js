import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { schemes } from "./lib";
import { getFileData, getRandomInt } from "./util";
import QuizScreen from "./QuizScreen";
import Toolbar from "./Toolbar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { cleanDeckSettings } from "./QuizDeck";
import { DeckList } from "./DeckList";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PaperProvider} from "react-native-paper";

const DATA_STORAGE_KEY = "DATA";

export default App = () => {
  //const colorScheme = useColorScheme();
  const colorScheme = "light";
  const [deckListData, setDeckListData] = useState([]);
  const [currentDeck, setCurrentDeck] = useState([]);
  //const [currState, setCurrState] = useState({currQ: null, questionBag: null});
  const [currSource, setCurrSource] = useState({mimeType: null, name: null, size: null, uri: null, deckId: null});
  const [questionData, setQuestionData] = useState([]);
  const [deckSettings, setDeckSettings] = useState(cleanDeckSettings(null, null, null));

  const scheme = colorScheme === "dark" ? styles.schemeDark : styles.schemeLight;

  // @todo bug with this... next question doesnt work as expected
  //const nextQuestion = () => {
  //  setCurrState({...currState, currQ: null});
  //};

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

  //const fillQuestionBag = () => {
  //  // randomize questions
  //  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#46545530
  //  const questionBag = questionData
  //    .map(value => ({ value, sort: Math.random() }))
  //    .sort((a, b) => a.sort - b.sort)
  //    .map(({ value }) => value)
  //  setCurrState({...currState, currQ: null, questionBag});
  //}

  const clearDeck = () => {
    setCurrentDeck([]);
    //setQuestionData([]);
    //setCurrState({currQ: null, questionBag: null});
  }

  const updateDeckSettings = (pickOrder, pickMode, cardMode) => {
    setDeckSettings(cleanDeckSettings(pickOrder, pickMode, cardMode));

    // reset deck
    setQuestionsFromFile(currSource.uri);
    fillQuestionBag();
  }

  const setQuestionsFromFile = async (uri) => {
    setQuestionData(await getFileData(uri));
  }

  const deckAdded = ({mimeType, name, size, uri}) => {
    if (!deckListData.find(deckDatum => deckDatum.uri === uri)) {
      const newDeck = {mimeType, name, size, uri};
      const deckId = getRandomInt(10000000, 99999999);
      const newDeckListData = deckListData;
      deckListData.push({deckId,  ...newDeck});
      setDeckListData(newDeckListData);
      saveData(newDeckListData);
    }
  }

  const onPressDeck = (deckId) => {
    const selectedDeck = deckListData.find(deck => deck.deckId === deckId);
    if (selectedDeck) {
      setQuestionsFromFile(selectedDeck.uri)
    } else {
      clearDeck();
    }
  }

  const loadDeckListData = async () => {
    try {
      const value = await AsyncStorage.getItem(DATA_STORAGE_KEY);
      if (value !== null) {
        setDeckListData(JSON.parse(value));
      }
    } catch (e) {
      // error reading value
    }
  };

  const saveData = async (newDeckListData) => {
    try {
      await AsyncStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(newDeckListData));
    } catch (e) {
      console.log('Error saving: ' + JSON.stringify(e));
    }
  }

  const onDelete = async (deckId) => {
    const newDeckListData = deckListData.filter(deckDatum => deckDatum.deckId !== deckId);
    setDeckListData(newDeckListData);
    saveData(newDeckListData);
  }

  //useEffect(() => {
  //  // @todo need this odd complexity?
  //  // @todo need the useeffect?
  //  if (currState.questionBag) {
  //    if (currState.questionBag.length > 0) {
  //      if (!currState.currQ) {
  //        // load next question
  //        const newQuestionBag = currState.questionBag;
  //        setCurrState({currQ: newQuestionBag.pop(), questionBag: newQuestionBag});
  //      }
  //    } else {
  //      fillQuestionBag();
  //    }
  //  }
  //}, [currState]);

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
    const loadDeckData = async () => await loadDeckListData();
    if (deckListData.length === 0) {
      loadDeckData();
    }
  }, []);

  //console.log('state: ' + JSON.stringify({
  //  currState,
  //  currSource,
  //  questionData,
  //  deckSettings,
  //}));

  const currentView = currentDeck.length > 0 ? 'quizView' : 'homeView';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <PaperProvider>
          <View style={[styles.container, scheme.bg]}>
            <Toolbar style={styles.toolbarContainer} showBack={questionData.length > 0} title={"@TODO deck name goes here"} backCallback={clearDeck} colorScheme={colorScheme} />
            { currentView === 'quizView' && (
              <QuizScreen
                currentDeck={currentDeck}
                colorScheme={colorScheme}
                deckSettings={deckSettings}
                updateDeckSettings={updateDeckSettings}
              />
            )}
            { currentView === 'homeView' && (
                <DeckList deckListData={deckListData} onPressDeck={onPressDeck} onPressText={pickQuestionFileTxt} onDelete={onDelete} />
            )}
            <StatusBar style="dark" />
          </View>
        </PaperProvider>
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
  ...schemes
});
