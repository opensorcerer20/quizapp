import { useEffect, useState } from "react";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from 'expo-file-system';
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { FAB, Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DECK_QA_KEY, MAX_DECKS, MIME_TYPE_CSV, MIME_TYPE_TEXT, NEW_DECK_ADDED } from "../common/constants";
import { loadAllDecks, loadDemoData, removeStorageData, saveDeckData, saveDeckListData } from "../common/fileLib";
import { globalStyles } from "../common/lib";
import { getRandomInt, getScheme, sanitizeAll } from "../common/util";
import DeckListItem from "../components/Deck/DeckListItem";
import { getFileData, makeNewDeck, makeNewDeckData } from "../components/Deck/QuizDeck";
import FileHelpModal from "../components/FileHelpModal";
import { useTheme } from "../components/Providers/ThemeProvider";
import ScreenTemplate from "../components/ScreenTemplate";
import TextNormal from "../components/TextNormal";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "react-native-toast-message";

const emptyImportSource = {
  mimeType: null,
  name: null,
  size: null,
  uri: null,
};

export const DeckList = () => {
  // reset storage
  // AsyncStorage.clear();

  const [importSource, setImportSource] = useState(emptyImportSource);
  const [deckListData, setDeckListData] = useState([]);
  const [reload, setReload] = useState(false);
  const [showFileHelp, setShowFileHelp] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const routeParams = useLocalSearchParams();

  const { theme } = useTheme();
  const scheme = getScheme(theme);

  const [fabOpen, setFabOpen] = useState(false);
  const onFABClick = ({ open }) => {
    setFabOpen(!!open);
  };

  const showFileHelpModal = () => {
    setFabOpen(false);

    setTimeout(() => {
      setShowFileHelp(true);
    }, 300);
  };

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

  // @todo use importNewDeck to handle all new deck imports (or at least new deck creation via textarea)
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

  const renderItem = ({ item }) => {
    return (
      <DeckListItem item={item} onPressDeck={onPressDeck} onDeleteDeck={onDeleteDeck} onUpdateDeck={onUpdateDeck} />
    );
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

  // @todo issue moving deck list item out: need to trigger rename modal when deck is added
  // setRenameState({ ...renameState, showCancel: false, visible: true, editingDeck: newDeck });

  const onClickNew = () => {
    router.navigate({
      pathname: "NewDeck",
      params: {},
    });
  };

  const onConfirmExport = async () => {
    const content = 'This is the content of my text file.';

    // console.log('before writing');
    try {
      /*
      - save file to filesystem and be able to find that file
        - documents?
        - downloads?
        - user picked?
      - export decks as question 1\nanswer1\netc\netc, with 2 blank lines between decks, no titles
      */
      const file = new File(Paths.document, 'export.txt');
      if (!file.exists) {
        file.create(); // can throw an error if the file already exists or no permission to create it
        file.write(content);
        Toast.show({
          type: 'success',
          text1: 'File created',
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'File already exists',
        });
      }
      // console.error('success writing file:');
    } catch (error) {
      console.error('Error writing file:', error);
      Toast.show({
        type: 'error',
        text1: 'Error writing file',
      });
    }
    setConfirmModalVisible(false);
  };

  // actions after source specified
  useEffect(() => {
    if (importSource.uri) {
      importDeck(importSource.uri);
    }
  }, [importSource]);

  useEffect(() => {
    if (routeParams[NEW_DECK_ADDED] === "true") {
      setReload(true);
      router.setParams({ NEW_DECK_ADDED: false });
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
  useEffect(() => {
    const loadData = async () => {
      await loadDeckListData();
    };
    loadData();
  }, []);

  // load demo data if no data currently saved (checks async storage)
  useEffect(() => {
    const checkData = async () => {
      const result = await loadDemoData();
      if (result === true) {
        setReload(true);
      }
    };
    checkData();
  }, []);

  const path = usePathname();
  const showFab = path === "/" && deckListData.length < MAX_DECKS;
  const insets = useSafeAreaInsets();

  return (
    <ScreenTemplate showBack={false} helpType={"list"} showExport={true} onExport={() => console.log('export clicked')}>
      <View style={styles.container}>
        {deckListData.length > 0 && (
          <View style={{ padding: 10 }}>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <TextNormal style={[scheme.txt, { flex: 1, paddingVertical: 7, paddingHorizontal: 3 }]}>Saved Decks</TextNormal>
              <View style={{ marginLeft: "auto", marginRight: 0 }}>
                <Pressable onPress={() => setConfirmModalVisible(true)}>
                    <MaterialCommunityIcons name="file-download-outline" size={30} color={scheme.txt.color} />
                </Pressable>
              </View>
            </View>
            <FlatList
              data={deckListData}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: insets.bottom }}
            />
          </View>
        )}
        {deckListData.length < 1 && (
          <TextNormal style={[scheme.txt, { padding: 10 }]}>No decks in memory, please add a deck</TextNormal>
        )}
        {showFab && (
          <>
            <Portal>
              <FAB.Group
                open={fabOpen}
                visible
                icon="plus"
                color={scheme.buttonTxt.color}
                fabStyle={scheme.buttonBg}
                actions={[
                  {
                    icon: "form-textbox", // material community icon
                    label: "Create Deck",
                    onPress: onClickNew,
                  },
                  {
                    icon: "help", // material community icon
                    label: "File Help",
                    onPress: showFileHelpModal,
                  },
                  {
                    icon: "text", // material community icon
                    label: "Import TXT",
                    onPress: () => onPressImport("txt"),
                  },
                  {
                    icon: "table", // material community icon
                    label: "Import CSV",
                    onPress: () => onPressImport("csv"),
                  },
                ]}
                onStateChange={onFABClick}
              />
            </Portal>
            <FileHelpModal scheme={scheme} showModal={showFileHelp} setShowModal={setShowFileHelp} />
          </>
        )}
        {deckListData.length >= MAX_DECKS && <FAB icon="plus" style={[globalStyles.fab, scheme.disabled]} />}
      </View>
      <ConfirmModal
          scheme={scheme}
          confirmModalVisible={confirmModalVisible}
          handleCancel={() => setConfirmModalVisible(false)}
          handleConfirm={onConfirmExport}
          message="Would you like to export all flash cards to export.txt?"
          confirmLabel="Export"
        />
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  menu: {
    position: "absolute",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default DeckList;
