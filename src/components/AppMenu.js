import { Pressable, StyleSheet, Text, View } from "react-native";

export const DECK_LIST_MENU_WIDTH = 150;

const AppMenu = ({ scheme }) => {
  return (
    <View style={{ width: DECK_LIST_MENU_WIDTH }}>
      <Pressable onPress={() => {}}>
        <View style={styles.menuItem}>
          <Text style={[styles.menuText, scheme.txt]}>App Menu</Text>
        </View>
      </Pressable>
      {/* <Pressable onPress={() => {}}>
        <View style={styles.menuItem}>
          <FontAwesome6 name="pen-to-square" size={20} color="black" style={styles.menuIcon} />
          <Text style={styles.menuText}>Rename</Text>
        </View>
      </Pressable>
      <Pressable onPress={() => {}}>
        <View style={styles.menuItem}>
          <FontAwesome6 name="trash" size={20} color="black" style={styles.menuIcon} />
          <Text style={styles.menuText}>Delete</Text>
        </View>
      </Pressable> */}
    </View>
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

export default AppMenu;
