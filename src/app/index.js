import {
  useEffect,
  useState,
} from "react";

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

import {
  DECK_DATA_KEY,
  DECK_QA_KEY,
  THEMES,
} from "../common/constants";
import {
  loadStorageData,
  removeStorageData,
  saveStorageData,
} from "../common/fileLib";
import { lightDarkStyles } from "../common/lib";
import { useTheme } from "../components/Providers/ThemeProvider";
import ScreenTemplate from "../components/ScreenTemplate";
import Toolbar from "../components/Toolbar";
import { DeckList } from "./DeckList";

export default QuizApp = () => {
  // const USE_STATIC_DATA = false;
  const [deckListData, setDeckListData] = useState([]);
  const [reload, setReload] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const scheme = theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;

  // @todo move to decklist
  const onPressDeck = async (id) => {
    router.navigate({
      pathname: "QuizScreen",
      params: { deckId: id },
    });
  };

  // @todo should i move to decklist?
  const loadDeckListData = async () => {
    let newDeckListData = await loadStorageData(DECK_DATA_KEY);
    if (Array.isArray(newDeckListData)) {
      newDeckListData.sort((a, b) => b.createdAt - a.createdAt);
      setDeckListData(newDeckListData);
    } else {
      setDeckListData([]);
    }

    // if reload was set, set back to false
    setReload(false);
  };

  // @todo should i move to decklist?
  const onAddDeck = async (newDeck, newDeckData) => {
    let newDeckListData = deckListData.slice();

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

  // @todo should i move to decklist?
  const onDeleteDeck = async (deckId) => {
    const newDeckListData = deckListData.filter((deckDatum) => deckDatum.id !== deckId);
    await updateDeckListData(newDeckListData);
    await removeStorageData(DECK_QA_KEY + `_${deckId}`);
  };

  const updateDeckListData = async (newDeckListData) => {
    setDeckListData(newDeckListData);
    saveDeckListData(newDeckListData);
  };

  // @todo should i move to decklist?
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

  // console.log(
  //     "quizapp state " +
  //         JSON.stringify({ deckListData, currentView, currentDeck })
  // );

  return (
    <ScreenTemplate>
      <Toolbar showBack={false} theme={theme} toggleTheme={toggleTheme} />
      <DeckList
        deckListData={deckListData}
        onPressDeck={onPressDeck}
        onAddDeck={onAddDeck}
        onDeleteDeck={onDeleteDeck}
        onUpdateDeck={onUpdateDeck}
      />
      <StatusBar style="dark" />
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     flexDirection: "column",
  //     //marginTop: 50,
  //   },
  //   insideContainer: {
  //     flex: 10,
  //   },
  ...lightDarkStyles,
});
