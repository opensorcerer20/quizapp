import { useEffect, useState } from "react";

import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";

import { DECK_QA_KEY, MAX_DECKS, MIME_TYPE_CSV, MIME_TYPE_TEXT, RELOAD_LIST } from "../common/constants";
import { loadAllDecks, loadDemoData, removeStorageData, saveDeckData, saveDeckListData } from "../common/fileLib";
import { globalStyles } from "../common/lib";
import { getRandomInt, getScheme, sanitizeAll } from "../common/util";
import AddDeckModal from "../components/AddDeckModal";
import DeckListItem from "../components/Deck/DeckListItem";
import { getFileData, makeNewDeck, makeNewDeckData } from "../components/Deck/QuizDeck";
import Export from "../components/Export";
import FileHelpModal from "../components/FileHelpModal";
import { useTheme } from "../components/Providers/ThemeProvider";
import { useLocale } from "../components/Providers/TranslationProvider";
import ScreenTemplate from "../components/ScreenTemplate";
import TextNormal from "../components/TextNormal";
import TutorialModal from "../components/TutorialModal";

const emptyImportSource = {
  mimeType: null,
  name: null,
  size: null,
  uri: null,
};

export const DeckList = () => {
  // reset storage
  // localstorage.clear();
  const { getLocalString } = useLocale();
  const [importSource, setImportSource] = useState(emptyImportSource);
  const [deckListData, setDeckListData] = useState([]);
  const [reload, setReload] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showFileHelp, setShowFileHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const routeParams = useLocalSearchParams();

  const { theme } = useTheme();
  const scheme = getScheme(theme);

  const loadDeckListData = async () => {
    let newDeckListData = await loadAllDecks();
    if (Array.isArray(newDeckListData)) {
      newDeckListData.sort((a, b) => b.createdAt - a.createdAt);
      setDeckListData(newDeckListData);
    } else {
      setDeckListData([]);
    }

    // if reload was set, set back to false
    setReload(false);
  };

  const onPressDeck = async (id) => {
    router.navigate({
      pathname: "QuizScreen",
      params: { deckId: id },
    });
  };

  const onAddDeck = async (newDeck, newDeckData) => {
    let newDeckListData = deckListData.slice();

    newDeckListData.push(newDeck);
    await saveDeckData(newDeck.id, newDeckData);
    const result = await saveDeckListData(newDeckListData);
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
    await saveDeckListData(newDeckListData);
  };

  const onPressImport = async (type) => {
    const fileType = type === "csv" ? MIME_TYPE_CSV : MIME_TYPE_TEXT;
    try {
      const docRes = await DocumentPicker.getDocumentAsync({
        type: fileType,
      });

      if (!docRes.assets[0].uri) {
        throw new Error("No URI for document source");
      }

      setImportSource(docRes.assets[0]);
    } catch (error) {
      console.log("Error while selecting text file: ", JSON.stringify(error));
    }
  };

  const importDeck = async () => {
    // generate deck id that doesnt already exist
    let newDeckId;
    let limit = 0;
    do {
      newDeckId = getRandomInt(100000, 999999);
      limit++;
    } while (deckListData.filter((deck) => deck.id === newDeckId).length > 0 && limit < 10);
    if (limit >= 10) {
      console.log("loop limit for deck id, last id: " + newDeckId);
      return;
    }

    const newQuestionArray = await getFileData(importSource);
    const [newDeckName] = importSource.name.split(".");
    const newDeck = makeNewDeck(newDeckId, sanitizeAll(newDeckName));
    const newDeckData = makeNewDeckData(newDeckId, newQuestionArray);

    await onAddDeck(newDeck, newDeckData);

    setImportSource(emptyImportSource);
  };

  const onClickNew = () => {
    router.navigate({
      pathname: "NewDeck",
      params: {},
    });
  };

  // actions after source specified
  useEffect(() => {
    if (importSource.uri) {
      importDeck(importSource.uri);
    }
  }, [importSource]);

  useEffect(() => {
    if (routeParams[RELOAD_LIST] === "true") {
      setReload(true);
      router.setParams({ RELOAD_LIST: false });
    }
  }, [routeParams]);

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
  // storage is async, so the demo deck has to be seeded before the list is
  // read - otherwise the list can resolve empty and show "no decks in memory"
  useEffect(() => {
    const loadData = async () => {
      await loadDemoData();
      await loadDeckListData();
    };
    loadData();
  }, []);

  const path = usePathname();
  const showFab = path === "/" && deckListData.length < MAX_DECKS;

  return (
    <ScreenTemplate showBack={false} helpType={"list"}>
      <View style={styles.container}>
        {deckListData.length > 0 && (
          <GestureHandlerRootView style={{ padding: 0 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <TextNormal
                style={[scheme.txtForBg, { flex: 1, paddingVertical: 7, paddingHorizontal: 3, fontSize: 20 }]}
              >
                {getLocalString("Saved Decks")}
              </TextNormal>
              <Export deckListData={deckListData} />
            </View>
            <FlatList
              data={deckListData}
              renderItem={({ item }) => (
                <DeckListItem item={item} onPressDeck={onPressDeck} onDeleteDeck={onDeleteDeck} />
              )}
              testID="deck-list"
              // contentContainerStyle={{ paddingBottom: insetStyle.paddingBottom }}
            />
          </GestureHandlerRootView>
        )}
        {deckListData.length < 1 && (
          <TextNormal style={[scheme.txt, { padding: 10 }]}>
            {getLocalString("No decks in memory, please add a deck")}
          </TextNormal>
        )}
        {showFab && (
          <>
            <FAB
              icon="plus"
              style={[globalStyles.fab, globalStyles.fabButton, scheme.buttonBg]}
              color={scheme.txt.color}
              onPress={() => setShowAddMenu(true)}
            />
            <AddDeckModal
              scheme={scheme}
              showModal={showAddMenu}
              setShowModal={setShowAddMenu}
              onPressCreate={onClickNew}
              onPressTxt={() => onPressImport("txt")}
              onPressCsv={() => onPressImport("csv")}
              onPressHelp={() => setShowFileHelp(true)}
            />
            <FileHelpModal scheme={scheme} showModal={showFileHelp} setShowModal={setShowFileHelp} />
          </>
        )}
      </View>
      <TutorialModal showModal={showTutorial} setShowModal={setShowTutorial} scheme={scheme} />
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  menu: {
    position: "absolute",
    backgroundColor: globalStyles.bgWhite.backgroundColor,
    padding: 10,
    borderRadius: 5,
    shadowColor: globalStyles.bgBlack.backgroundColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default DeckList;
