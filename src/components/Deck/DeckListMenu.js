import { Pressable, StyleSheet, View } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import TextNormal from "../TextNormal";

export const DECK_LIST_MENU_WIDTH = 120;

const DeckListMenu = ({ handleViewClick, handleRenameClick, handleDeleteClick }) => {
  return (
    <>
      <Pressable onPress={handleViewClick}>
        <View style={styles.menuItem}>
          <FontAwesome6 name="eye" size={20} color="black" style={styles.menuIcon} />
          <TextNormal style={styles.menuText}>View</TextNormal>
        </View>
      </Pressable>
      <Pressable onPress={handleRenameClick}>
        <View style={styles.menuItem}>
          <FontAwesome6 name="pen-to-square" size={20} color="black" style={styles.menuIcon} />
          <TextNormal style={styles.menuText}>Rename</TextNormal>
        </View>
      </Pressable>
      <Pressable onPress={handleDeleteClick}>
        <View style={styles.menuItem}>
          <FontAwesome6 name="trash" size={20} color="black" style={styles.menuIcon} />
          <TextNormal style={styles.menuText}>Delete</TextNormal>
        </View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 30,
  },
  menuText: {
    paddingLeft: 5,
  },
});

export default DeckListMenu;
