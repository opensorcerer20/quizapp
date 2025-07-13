import { useEffect, useState } from "react";

import * as DocumentPicker from "expo-document-picker";
import { router, usePathname } from "expo-router";
import { Dimensions, FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Button, FAB, Portal } from "react-native-paper";

import { DECK_DATA_KEY, DECK_QA_KEY, MAX_DECKS, MIME_TYPE_CSV, MIME_TYPE_TEXT, SAFE_WIDTH } from "../common/constants";
import { loadStorageData, removeStorageData, saveDeckData, saveDeckListData } from "../common/fileLib";
import { getBgScheme, getRandomInt, getScheme, sanitizeAll } from "../common/util";
import DeckListMenu, { DECK_LIST_MENU_WIDTH } from "../components/Deck/DeckListMenu";
import DeckRenameModal from "../components/Deck/DeckRenameModal";
import { emptyDeck, getFileData, makeNewDeck, makeNewDeckData } from "../components/Deck/QuizDeck";
import { useTheme } from "../components/Providers/ThemeProvider";
import QuizModal from "../components/QuizModal";
import ScreenTemplate from "../components/ScreenTemplate";

const emptyImportSource = {
  mimeType: null,
  name: null,
  size: null,
  uri: null,
};

export const DeckList = () => {
  const { width } = Dimensions.get("window");

  const [importSource, setImportSource] = useState(emptyImportSource);
  const [deckListData, setDeckListData] = useState([]);
  const [reload, setReload] = useState(false);
  const [menuState, setMenuState] = useState({
    visible: false,
    position: { top: 0, left: 0 },
  });
  const [renameState, setRenameState] = useState({
    deckId: null,
    editingDeck: emptyDeck,
    visible: false,
    showCancel: false,
  });

  const { theme } = useTheme();
  const scheme = getScheme(theme);
  const schemeBg = getBgScheme(theme);

  const [fabOpen, setFabOpen] = useState(false);
  const onFABClick = ({ open }) => {
    setFabOpen(!!open);
  };

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

  const unSelectItem = () => {
    setRenameState({ ...renameState, editingDeck: emptyDeck });
    setMenuState({ ...menuState, visible: false });
  };

  const handleModalClickAway = () => {
    unSelectItem();
  };

  const handleMenuPress = (event, item) => {
    const { pageX, pageY } = event.nativeEvent;
    const modalWidth = 100;
    let modalX = Math.max(pageX - modalWidth, 0);
    modalX = Math.min(SAFE_WIDTH - DECK_LIST_MENU_WIDTH, modalX);
    setRenameState({ ...renameState, editingDeck: item });
    setMenuState({ position: { top: pageY, left: modalX }, visible: true });
  };

  const handleViewClick = () => {
    router.navigate({
      pathname: "DeckScreen",
      params: { deckId: renameState.editingDeck.id },
    });
    unSelectItem();
  };

  const handleRenameClick = () => {
    const selected = deckListData.filter((deck) => deck.id === renameState.editingDeck.id);
    if (selected.length === 1) {
      setMenuState({ ...menuState, visible: false });
      setRenameState({ ...renameState, showCancel: true, visible: true, editingDeck: selected[0] });
    } else {
      console.log("Error editing deck with id " + renameState.editingDeck.id);
      unSelectItem();
    }
  };

  const handleDeleteClick = () => {
    onDeleteDeck(renameState.editingDeck.id);
    unSelectItem();
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable key={item.id} onPress={() => onPressDeck(item.id)}>
        <View
          style={[
            styles.item,
            scheme.bgAccent3,
            renameState.editingDeck?.id === item.id ? { backgroundColor: scheme.txt.color } : {},
            scheme.border,
          ]}
        >
          <Text
            style={[
              styles.itemText,
              {
                color: renameState.editingDeck?.id === item.id ? schemeBg.antiTxtBg : scheme.txt.color,
              },
            ]}
          >
            {item.name.length > 35 ? item.name.slice(0, 30) + "..." : item.name}
          </Text>
          <View style={styles.itemMenuButton}>
            <Button
              textColor={renameState.editingDeck?.id === item.id ? schemeBg.antiTxtBg : scheme.txt.color}
              icon="dots-vertical"
              onPress={(event) => handleMenuPress(event, item)}
            />
          </View>
        </View>
      </Pressable>
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

    // @todo this is too big for useState
    setRenameState({ ...renameState, showCancel: false, visible: true, editingDeck: newDeck });
  };

  const clearEditModal = () => {
    setRenameState({ ...renameState, visible: false, editingDeck: emptyDeck });
  };

  const handleCancelClick = () => {
    clearEditModal();
  };

  const handleRenameDeck = (deckId, name) => {
    onUpdateDeck(deckId, { name: sanitizeAll(name) });
    clearEditModal();
  };

  // actions after source specified
  useEffect(() => {
    if (importSource.uri) {
      importDeck(importSource.uri);
    }
  }, [importSource]);

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

  const path = usePathname();
  const showFab = path === "/" && deckListData.length < MAX_DECKS;

  //console.log("testing console log (show debug data here) " + JSON.stringify({ editingDeck: renameState.editingDeck }));

  return (
    <ScreenTemplate showBack={false} helpType={"list"}>
      <View style={styles.container}>
        {deckListData.length > 0 && (
          <View style={{ padding: 10 }}>
            <Text style={[scheme.txt, { paddingVertical: 7, paddingHorizontal: 3 }]}>Saved Decks</Text>
            <FlatList data={deckListData} renderItem={renderItem} />
            <QuizModal modalVisible={renameState.visible} handleModalClickAway={() => {}}>
              <DeckRenameModal
                initialDeckName={renameState.editingDeck.name}
                editingDeck={renameState.editingDeck}
                handleCancelClick={handleCancelClick}
                handleRenameDeck={handleRenameDeck}
                showCancel={renameState.showCancel}
              />
            </QuizModal>

            <QuizModal
              modalVisible={menuState.visible}
              handleModalClickAway={handleModalClickAway}
              modalContainerStyle={[
                styles.menu,
                {
                  top: menuState.position.top,
                  left: menuState.position.left,
                },
              ]}
            >
              <DeckListMenu
                handleViewClick={handleViewClick}
                handleRenameClick={handleRenameClick}
                handleDeleteClick={handleDeleteClick}
              />
            </QuizModal>
          </View>
        )}
        {deckListData.length < 1 && (
          <Text style={[scheme.txt, { padding: 10 }]}>No decks in memory, please add a deck</Text>
        )}

        {showFab && (
          <Portal>
            <FAB.Group
              open={fabOpen}
              visible
              icon="plus"
              fabStyle={scheme.bgAntiPrimary}
              actions={[
                {
                  icon: "text",
                  label: "Text",
                  onPress: () => onPressImport("txt"),
                },
                {
                  icon: "table",
                  label: "CSV",
                  onPress: () => onPressImport("csv"),
                },
              ]}
              onStateChange={onFABClick}
            />
          </Portal>
        )}
        {deckListData.length >= MAX_DECKS && <FAB icon="plus" style={scheme.disabled} />}
      </View>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: "row",
    margin: 2,
    alignItems: "center",
    // boxShadow: "10px 10px 5px black",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  itemText: {
    flex: 10,
    fontSize: 16,
  },
  itemMenuButton: {
    flex: 1,
    paddingHorizontal: 5,
  },
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
  fabDisabled: {
    backgroundColor: "grey",
  },
});

export default DeckList;
