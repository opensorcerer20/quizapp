import { useState } from "react";

import { Pressable, StyleSheet, View } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { SAFE_WIDTH } from "../../common/constants";
import { formatCardText } from "../../common/util";
import ConfirmModal from "../ConfirmModal";
import { useLocale } from "../Providers/TranslationProvider";
import SwipeableListItem, { makeButtonSettings } from "../SwipeableListItem";
import TextNormal from "../TextNormal";

const DeckScreenItem = ({ item, scheme, handleDeleteConfirmClick, onVisibilityClick }) => {
  const { getLocalString } = useLocale();
  const [deleteCardId, setDeleteCardId] = useState(null);

  const handleDeleteCancelClick = () => {
    setDeleteCardId(null);
  };

  const onDeleteConfirmClick = async () => {
    await handleDeleteConfirmClick(deleteCardId);
    setDeleteCardId(null);
  };

  return (
    <SwipeableListItem
      style={{ marginHorizontal: 10 }}
      item={item}
      rightBtnSettings={makeButtonSettings(
        () => {
          console.log(">>> right press");
        },
        "Delete",
        "#cc0000",
        "#ffffff"
      )}
    >
      <View
        key={item.id}
        style={[scheme.bgAccent, styles.container, { borderColor: scheme.txt.color, flexDirection: "row" }]}
      >
        <Pressable
          style={{ flex: 1, paddingHorizontal: item.disabled ? 10 : 12, maxWidth: 50 }}
          onPress={() => onVisibilityClick(!item?.disabled, item.id)}
          onLongPress={() => onVisibilityClick(!item?.disabled, item.id)}
        >
          <FontAwesome6
            name={item.disabled ? "eye-slash" : "eye"}
            size={20}
            color={item.disabled ? scheme.bgDisabled.backgroundColor : scheme.txt.color}
            style={styles.menuIcon}
          />
        </Pressable>
        <Pressable onLongPress={() => setDeleteCardId(item.id)} style={{ flex: 1 }}>
          <View style={{ flexDirection: "col", maxWidth: SAFE_WIDTH * 0.9 }}>
            <TextNormal style={[scheme.txt, styles.itemText]}>
              <TextNormal style={{ fontWeight: "bold" }}>Q: </TextNormal>
              {formatCardText(`${item.q}`)}
            </TextNormal>
            <TextNormal style={[scheme.txt, styles.itemText]}>
              <TextNormal style={{ fontWeight: "bold" }}>A: </TextNormal>
              {formatCardText(`${item.a}`)}
            </TextNormal>
          </View>
        </Pressable>
      </View>
      <ConfirmModal
        message={getLocalString("Are you sure you want to delete this card?")}
        scheme={scheme}
        modalVisible={deleteCardId !== null}
        handleCancel={handleDeleteCancelClick}
        handleConfirm={onDeleteConfirmClick}
        confirmLabel="Delete"
      />
    </SwipeableListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingRight: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginVertical: 2,
    marginHorizontal: "auto",
    alignItems: "center",
    borderWidth: 1,
  },
  setAllButton: {
    flexDirection: "row",
    maxWidth: SAFE_WIDTH * 0.4,
  },
  itemText: {
    fontSize: 16,
    maxWidth: "90%",
  },
  menuIcon: {
    width: 30,
  },
});

export default DeckScreenItem;
