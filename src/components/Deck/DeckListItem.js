import { useState } from "react";

import { router } from "expo-router";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { SAFE_WIDTH } from "../../common/constants";
import { globalStyles } from "../../common/lib";
import { getScheme, sanitizeAll } from "../../common/util";
import { useTheme } from "../../components/Providers/ThemeProvider";
import QuizModal from "../../components/QuizModal";
import TextNormal from "../../components/TextNormal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import DeckListMenu, { DECK_LIST_MENU_WIDTH } from "./DeckListMenu";
import DeckRenameModal from "./DeckRenameModal";
import { emptyDeck } from "./QuizDeck";

export const DeckListItem = ({ item, onPressDeck, onDeleteDeck, onUpdateDeck }) => {
  // AsyncStorage.clear();

  const [menuState, setMenuState] = useState({
    visible: false,
    position: { top: 0, left: 0 },
  });
  const [deleteDeckId, setDeleteDeckId] = useState(null);
  const [renameState, setRenameState] = useState({
    deckId: null,
    editingDeck: emptyDeck,
    visible: false,
    showCancel: false,
  });

  const { theme } = useTheme();
  const scheme = getScheme(theme);

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
    setMenuState({ ...menuState, visible: false });
    setRenameState({ ...renameState, showCancel: true, visible: true, editingDeck: item });
  };

  const handleDeleteClick = () => {
    const selectedId = renameState.editingDeck.id;
    if (selectedId) {
      setMenuState({ ...menuState, visible: false });
      setDeleteDeckId(selectedId);
    }
  };

  const clearEditModal = () => {
    setRenameState({ ...renameState, visible: false, editingDeck: emptyDeck });
  };

  const handleCancelClick = () => {
    clearEditModal();
  };

  const handleDeleteCancelClick = () => {
    setDeleteDeckId(null);
    unSelectItem();
  };

  const handleRenameDeck = (deckId, name) => {
    onUpdateDeck(deckId, { name: sanitizeAll(name) });
    clearEditModal();
  };

  const handleConfirmDeleteClick = () => {
    onDeleteDeck(deleteDeckId);
    setDeleteDeckId(null);
    unSelectItem();
  };

  //console.log("testing console log (show debug data here) " + JSON.stringify({ editingDeck: renameState.editingDeck }));

  return (
    <>
      <Pressable
        key={item.id}
        onPress={() => onPressDeck(item.id)}
        onLongPress={(event) => handleMenuPress(event, item)}
      >
        <View
          style={[
            styles.container,
            scheme.bgPrimary,
            renameState.editingDeck?.id === item.id ? { backgroundColor: scheme.txt.color } : {},
            scheme.border,
          ]}
        >
          <TextNormal
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.txt,
              {
                color: renameState.editingDeck?.id === item.id ? scheme.bg.backgroundColor : scheme.txt.color,
              },
            ]}
          >
            {item.name}
          </TextNormal>
        </View>
      </Pressable>
      <View>
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
        <ConfirmDeleteModal
          modalVisible={deleteDeckId !== null}
          handleModalClickAway={handleDeleteCancelClick}
          scheme={scheme}
          handleCancelClick={handleDeleteCancelClick}
          handleConfirmClick={handleConfirmDeleteClick}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalStyles.bgWhite.backgroundColor,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: "row",
    margin: 2,
    alignItems: "center",
    // boxShadow: "10px 10px 5px black",
    ...Platform.select({
      ios: {
        shadowColor: globalStyles.bgBlack.backgroundColor,
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
  txt: {
    flex: 10,
    fontSize: 16,
  },
  menuButton: {
    flex: 1,
    paddingHorizontal: 5,
  },
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

export default DeckListItem;
