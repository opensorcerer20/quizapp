import { useState } from "react";

import { router } from "expo-router";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { clipWideString, getStrWidth, SAFE_WIDTH, THEMES } from "../../common/constants";
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
  const nameWidth = getStrWidth(item.name);
  const itemName = nameWidth > 280 ? clipWideString(item.name, 280) + "..." : item.name;

  return (
    <>
      <SwipeableListItem
        item={item}
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
          <View style={{ flexDirection: "row" }}>
            <Pressable onPress={() => handleViewClick(item.id)} style={{ marginVertical: "auto" }}>
              <View style={[scheme.bgPrimary, { borderColor: scheme.txt.color, paddingRight: 15 }]}>
                <MaterialCommunityIcons name={"cog"} size={20} color={scheme.txtForBg.color} />
              </View>
            </Pressable>
            <Pressable onPress={() => onPressDeck(item.id)} style={{ flex: 1 }}>
              <TextNormal
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: deleteDeckId === item.id ? scheme.bg.backgroundColor : scheme.txt.color,
                  fontSize: 18,
                }}
              >
                {itemName}
              </TextNormal>
            </Pressable>
          </View>
        </View>
      </SwipeableListItem>
      <ConfirmModal
        message={getLocalString("Are you sure you want to delete this deck?")}
        scheme={scheme}
        modalVisible={deleteDeckId !== null}
        handleCancel={handleDeleteCancelClick}
        handleConfirm={handleConfirmDeleteClick}
        confirmLabel={getLocalString("Delete")}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SAFE_WIDTH * 0.95,
    backgroundColor: globalStyles.bgWhite.backgroundColor,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    marginVertical: 4,
    marginHorizontal: "auto",
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
