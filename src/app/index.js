import { useEffect, useState } from "react";

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import { DECK_DATA_KEY, DECK_QA_KEY, THEMES, VIEWS } from "../common/constants";
// import { getStaticData } from "./Deck/QuizDeck";
import { loadQuestionsFromStorage, loadStorageData, removeStorageData, saveStorageData } from "../common/fileLib";
import { lightDarkStyles } from "../common/lib";
import { useTheme } from "../components/Providers/ThemeProvider";
import Toolbar from "../components/Toolbar";
import { DeckList } from "./DeckList";
import QuizScreen from "./QuizScreen";

export default QuizApp = () => {
  // const USE_STATIC_DATA = false;
  const { theme } = useTheme();
  const [deckListData, setDeckListData] = useState([]);
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentDeckData, setCurrentDeckData] = useState([]);
  const [reload, setReload] = useState(false);

  const scheme = theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;

  const clearDeck = () => {
    setCurrentDeck(null);
    setCurrentDeckData([]);
  };

  const onPressDeck = async (id) => {
    const selectedDeck = deckListData.find((deck) => deck.id === id);
    const selectedDeckData = await loadQuestionsFromStorage(id);
    if (selectedDeck && Array.isArray(selectedDeckData?.questions) && selectedDeckData.questions.length) {
      // setCurrentDeck(selectedDeck);
      // setCurrentDeckData(selectedDeckData.questions);

      router.navigate({
        pathname: "QuizScreen",
        params: { deckId: id },
      });
      // navigation.navigate("QuizScreen", {
      //   screen: "QuizScreen",
      //   params: {
      //     headerShown: false,
      //     deckId: id,
      //   },
      // });
    } else {
      clearDeck();
    }
  };

  const loadDeckListData = async () => {
    // not working, doesnt separate decklist and deckdata
    // if (USE_STATIC_DATA) {
    //     const staticDeckInfo = getStaticData();
    //     setDeckListData(staticDeckInfo.staticDeckListData);
    // } else {
    let newDeckListData = await loadStorageData(DECK_DATA_KEY);
    if (Array.isArray(newDeckListData)) {
      newDeckListData.sort((a, b) => b.createdAt - a.createdAt);
      setDeckListData(newDeckListData);
    } else {
      setDeckListData([]);
    }
    setReload(false);
    // }
  };

  const onAddDeck = async (newDeck, newDeckData) => {
    let newDeckListData = deckListData.slice();

    // @todo only save deck data not qa data

    newDeckListData.push(newDeck);
    await saveDeckListData(newDeckListData);
    await saveStorageData(DECK_QA_KEY + `_${newDeck.id}`, newDeckData);
  };

  const saveDeckListData = async (deckListData) => {
    const result = await saveStorageData(DECK_DATA_KEY, deckListData);
    if (result === true) {
      setReload(true);
    }
  };

  const onDeleteDeck = async (deckId) => {
    const newDeckListData = deckListData.filter((deckDatum) => deckDatum.id !== deckId);
    await updateDeckListData(newDeckListData);
    await removeStorageData(DECK_QA_KEY + `_${deckId}`);
  };

  const updateDeckListData = async (newDeckListData) => {
    setDeckListData(newDeckListData);
    saveDeckListData(newDeckListData);
  };

  const onUpdateDeck = async (deckId, data) => {
    let updatedDeck = deckListData.filter((deck) => deck.id === deckId);
    if (updatedDeck.length === 1) {
      updatedDeck[0].name = data.name;
      const newDeckListData = deckListData.map((deck) => {
        if (deck.id === deckId) {
          return updatedDeck[0];
        }
        return deck;
      });
      await updateDeckListData(newDeckListData);
    } else {
      console.log("couldnt edit single deck with id " + deckId);
    }
  };

  // load data if either first time or reload is tripped
  useEffect(() => {
    if (reload) {
      const loadData = async () => {
        await loadDeckListData();
      };
      loadData();
    }
  }, [reload]);

  // load data first time
  useEffect(() => {
    const loadData = async () => {
      await loadDeckListData();
    };
    loadData();
  }, []);

  // use to clear memory
  //useEffect(() => {
  //    saveDeckListData([]);
  //}, []);

  /*
  navigation.navigate('root', {
    screen: 'QuizScreen',
    params: {
      headerShown: false
    },
  });
  */

  // const currentView = !!currentDeck ? VIEWS.quizView : VIEWS.homeView;
  const currentView = VIEWS.homeView;

  // console.log(
  //     "quizapp state " +
  //         JSON.stringify({ deckListData, currentView, currentDeck })
  // );

  return (
    <View style={[styles.container, scheme.bg, scheme.txt]}>
      <Toolbar
        style={styles.toolbarContainer}
        currentView={currentView}
        title={currentDeck?.name || ""}
        backCallback={clearDeck}
      />
      {currentView === VIEWS.quizView && <QuizScreen currentDeck={currentDeck} currentDeckData={currentDeckData} />}
      {currentView === VIEWS.homeView && (
        <DeckList
          deckListData={deckListData}
          onPressDeck={onPressDeck}
          onAddDeck={onAddDeck}
          onDeleteDeck={onDeleteDeck}
          onUpdateDeck={onUpdateDeck}
        />
      )}
      <StatusBar style="dark" />
    </View>
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
  ...lightDarkStyles,
});
