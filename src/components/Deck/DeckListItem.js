import { useState } from "react";

import { router } from "expo-router";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { THEMES } from "../../common/constants";
import { globalStyles } from "../../common/lib";
import { getScheme, sanitizeAll } from "../../common/util";
import { useTheme } from "../../components/Providers/ThemeProvider";
import TextNormal from "../../components/TextNormal";
import ConfirmModal from "../ConfirmModal";
import { useLocale } from "../Providers/TranslationProvider";
import SwipeableListItem, { makeButtonSettings } from "../SwipeableListItem";

export const DeckListItem = ({ item, onPressDeck, onDeleteDeck, onUpdateDeck }) => {
  // AsyncStorage.clear();
  const { getLocalString } = useLocale();

  const [deleteDeckId, setDeleteDeckId] = useState(null);
  // const [renameState, setRenameState] = useState({
  //   deckId: null,
  //   editingDeck: emptyDeck,
  //   visible: false,
  //   showCancel: false,
  // });

  const { theme } = useTheme();
  const scheme = getScheme(theme);

  // const unSelectItem = () => {
  //   setRenameState({ ...renameState, editingDeck: emptyDeck });
  // };

  // const handleModalClickAway = () => {
  //   unSelectItem();
  // };

  const handleViewClick = (id) => {
    router.navigate({
      pathname: "DeckScreen",
      params: { deckId: id },
    });
    // unSelectItem();
  };

  // const handleRenameClick = () => {
  // setRenameState({ ...renameState, showCancel: true, visible: true, editingDeck: item });
  // };

  const handleDeleteClick = (selectedId) => {
    if (selectedId) {
      setDeleteDeckId(selectedId);
    }
  };

  // const clearEditModal = () => {
  //   setRenameState({ ...renameState, visible: false, editingDeck: emptyDeck });
  // };

  const handleCancelClick = () => {
    clearEditModal();
  };

  const handleDeleteCancelClick = () => {
    setDeleteDeckId(null);
    // unSelectItem();
  };

  const handleRenameDeck = (deckId, name) => {
    onUpdateDeck(deckId, { name: sanitizeAll(name) });
    clearEditModal();
  };

  const handleConfirmDeleteClick = () => {
    onDeleteDeck(deleteDeckId);
    setDeleteDeckId(null);
    // unSelectItem();
  };

  //console.log("testing console log (show debug data here) " + JSON.stringify({ editingDeck: renameState.editingDeck }));

  return (
    <>
      <Pressable key={item.id} onPress={() => onPressDeck(item.id)}>
        <SwipeableListItem
          item={item}
          leftBtnSettings={makeButtonSettings(
            () => handleViewClick(item.id),
            null,
            scheme.buttonBg.backgroundColor,
            scheme.buttonTxt.color,
            "credit-card-edit-outline"
          )}
          rightBtnSettings={makeButtonSettings(
            () => handleDeleteClick(item.id),
            null,
            "#cc0000",
            "#ffffff",
            "trash-can-outline"
          )}
        >
          <View
            style={[
              styles.container,
              scheme.bgPrimary,
              deleteDeckId === item.id ? { backgroundColor: scheme.txt.color } : {},
              {
                borderWidth: 1,
                borderColor: theme === THEMES.dark ? globalStyles.txtWhite.color : globalStyles.txtBlack.color,
              },
            ]}
          >
            <TextNormal
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: deleteDeckId === item.id ? scheme.bg.backgroundColor : scheme.txt.color,
                fontSize: item.name.length >= 24 ? 14 : 18,
              }}
            >
              {item.name}
            </TextNormal>
          </View>
        </SwipeableListItem>
      </Pressable>
      {/* <DeckRenameModal
        initialDeckName={renameState.editingDeck.name}
        editingDeckId={renameState.editingDeck.id}
        handleCancelClick={handleCancelClick}
        handleRenameDeck={handleRenameDeck}
        showCancel={renameState.showCancel}
        visible={renameState.visible}
      /> */}
      <ConfirmModal
        message={getLocalString("Are you sure you want to delete this deck?")}
        scheme={scheme}
        modalVisible={deleteDeckId !== null}
        handleCancel={handleDeleteCancelClick}
        handleConfirm={handleConfirmDeleteClick}
        confirmLabel="Delete"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalStyles.bgWhite.backgroundColor,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    marginVertical: 4,
    marginHorizontal: 2,
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
});

export default DeckListItem;
