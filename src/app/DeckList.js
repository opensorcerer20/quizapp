import {
  useEffect,
  useState,
} from "react";

import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Button,
  FAB,
  Portal,
} from "react-native-paper";

import {
  MAX_DECKS,
  MIME_TYPE_CSV,
  MIME_TYPE_TEXT,
  THEMES,
} from "../common/constants";
import { lightDarkStyles } from "../common/lib";
import {
  getRandomInt,
  sanitizeAll,
} from "../common/util";
import DeckListMenu, { DECK_LIST_MENU_WIDTH } from "../components/Deck/DeckListMenu";
import DeckRenameModal from "../components/Deck/DeckRenameModal";
import {
  emptyDeck,
  getFileData,
  makeNewDeck,
  makeNewDeckData,
} from "../components/Deck/QuizDeck";
import { useTheme } from "../components/Providers/ThemeProvider";
import QuizModal from "../components/QuizModal";

const emptyImportSource = {
  mimeType: null,
  name: null,
  size: null,
  uri: null,
};

export const DeckList = ({ deckListData, onPressDeck, onDeleteDeck, onAddDeck, onUpdateDeck }) => {
  const { width } = Dimensions.get("window");
  const SAFE_WIDTH = width - Math.round(width / 20); // 95% width

  const [importSource, setImportSource] = useState(emptyImportSource);

  // used when deck menu is pressed
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingDeck, setEditingDeck] = useState(emptyDeck);
  const [deckName, setDeckName] = useState("");
  const [showCancel, setShowCancel] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);

  const { theme } = useTheme();
  const scheme = theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;

  // @todo this is used when fab is clicked, need renaming
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  const unSelectItem = () => {
    setSelectedItem(null);
    setMenuVisible(false);
  };

  const handleModalClickAway = () => {
    unSelectItem();
  };

  const handleMenuPress = (event, item) => {
    const { pageX, pageY } = event.nativeEvent;
    const modalWidth = 100;
    let modalX = Math.max(pageX - modalWidth, 0);
    modalX = Math.min(SAFE_WIDTH - DECK_LIST_MENU_WIDTH, modalX);
    setMenuPosition({ top: pageY, left: modalX });
    setSelectedItem(item);
    setMenuVisible(true);
  };

  const handleViewClick = () => {
    router.navigate({
      pathname: "DeckScreen",
      params: { deckId: selectedItem.id },
    });
    unSelectItem();
  };

  const handleRenameClick = () => {
    const selected = deckListData.filter((deck) => deck.id === selectedItem.id);
    if (selected.length === 1) {
      setEditingDeck(selected[0]);
      setDeckName(selectedItem.name);
      setEditModalVisible(true);
      setMenuVisible(false);
      setShowCancel(true);
    } else {
      console.log("Error editing deck with id " + selectedItem.id);
      unSelectItem();
    }
  };

  const handleDeleteClick = () => {
    onDeleteDeck(selectedItem.id);
    unSelectItem();
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable key={item.id} onPress={() => onPressDeck(item.id)}>
        <View style={[styles.item, selectedItem?.id === item.id ? styles.selectedItem : {}]}>
          <Text style={styles.itemText}>{item.name.length > 35 ? item.name.slice(0, 30) + "..." : item.name}</Text>
          <View style={styles.itemMenuButton}>
            <Button textColor="black" icon="dots-vertical" onPress={(event) => handleMenuPress(event, item)} />
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
    const newDeck = makeNewDeck(newDeckId, newDeckName);
    const newDeckData = makeNewDeckData(newDeckId, newQuestionArray);

    await onAddDeck(newDeck, newDeckData);

    setImportSource(emptyImportSource);

    // @todo this is too big for useState
    setEditingDeck(newDeck);
    setDeckName(sanitizeAll(newDeckName));
    setEditModalVisible(true);
    setShowCancel(false);
  };

  const clearEditModal = () => {
    setEditModalVisible(false);
    setEditingDeck(emptyDeck);
    setDeckName("");
    setSelectedItem(null);
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

  // console.log(
  //     "testing console log (show debug data here) " + JSON.stringify({})
  // );

  return (
    <View style={styles.container}>
      {deckListData.length > 0 && (
        <>
          <Text style={[scheme.txt, { paddingVertical: 7, paddingHorizontal: 3 }]}>Saved Decks</Text>
          <FlatList data={deckListData} renderItem={renderItem} />
          <QuizModal modalVisible={editModalVisible} handleModalClickAway={() => {}}>
            {/* <Modal
            animationType="fade"
            transparent={true}
            visible={editModalVisible}
            onRequestClose={() => {
              setEditModalVisible(false);
            }}
          > */}
            <DeckRenameModal
              initialDeckName={deckName}
              editingDeck={editingDeck}
              handleCancelClick={handleCancelClick}
              handleRenameDeck={handleRenameDeck}
              showCancel={showCancel}
            />
          </QuizModal>

          <QuizModal
            modalVisible={menuVisible}
            handleModalClickAway={handleModalClickAway}
            modalContainerStyle={[
              styles.menu,
              {
                top: menuPosition.top,
                left: menuPosition.left,
              },
            ]}
          >
            <DeckListMenu
              handleViewClick={handleViewClick}
              handleRenameClick={handleRenameClick}
              handleDeleteClick={handleDeleteClick}
            />
          </QuizModal>
        </>
      )}
      {deckListData.length < 1 && <Text style={scheme.txt}>No decks in memory, please add a deck</Text>}

      {/* @todo bug: the fab is showing up on deckscreen when it shouldnt (router) */}

      {deckListData.length < MAX_DECKS && (
        // this is broken for iphone, specifically fab.group
        <Portal>
          <FAB.Group
            open={open}
            visible
            icon="plus"
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
            onStateChange={onStateChange}
          />
        </Portal>
      )}
      {deckListData.length >= MAX_DECKS && <FAB icon="plus" style={[styles.fab, { backgroundColor: "grey" }]} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  item: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    flexDirection: "row",
    margin: 2,
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#ffcccc",
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "orange",
  },
  ...lightDarkStyles,
});

export default DeckList;
