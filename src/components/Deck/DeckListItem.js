import { useState } from "react";

import { router } from "expo-router";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { THEMES } from "../../common/constants";
import { globalStyles } from "../../common/lib";
import { getScheme } from "../../common/util";
import { useTheme } from "../../components/Providers/ThemeProvider";
import TextNormal from "../../components/TextNormal";
import ConfirmModal from "../ConfirmModal";
import { useLocale } from "../Providers/TranslationProvider";
import SwipeableListItem, { makeButtonSettings } from "../SwipeableListItem";

export const DeckListItem = ({ item, onPressDeck, onDeleteDeck }) => {
  // AsyncStorage.clear();
  const { getLocalString } = useLocale();

  const [deleteDeckId, setDeleteDeckId] = useState(null);

  const { theme } = useTheme();
  const scheme = getScheme(theme);

  const handleViewClick = (id) => {
    router.navigate({
      pathname: "DeckScreen",
      params: { deckId: id },
    });
  };

  const handleDeleteClick = (selectedId) => {
    if (selectedId) {
      setDeleteDeckId(selectedId);
    }
  };

  const handleDeleteCancelClick = () => {
    setDeleteDeckId(null);
  };

  const handleConfirmDeleteClick = () => {
    onDeleteDeck(deleteDeckId);
    setDeleteDeckId(null);
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
