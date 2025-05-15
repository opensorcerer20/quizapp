import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useTheme } from "./ThemeProvider";
import { lightDarkStyles } from "./lib";
import { FAB, Portal } from "react-native-paper";
import { THEMES } from "./constants";

const MAX_DECKS = 50;

export const DeckList = ({ deckListData, onPressDeck, onDelete }) => {
    const [selectedItem, setSelectedItem] = useState(null); // used when menu is pressed to show which was selected
    const { theme } = useTheme();
    const scheme =
        theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;

    // @todo this is used when fab is clicked, need renaming
    const [state, setState] = useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;

    const renderItem = ({ item }) => {
        // console.log("item " + JSON.stringify(item));
        return (
            <Pressable
                key={item.id}
                onPress={() => onPressDeck(item.id)}
                onLongPress={() => onPressDeck(item.id)}
            >
                <View
                    style={[
                        styles.item,
                        selectedItem && item.id === selectedItem.id
                            ? styles.selectedItem
                            : {},
                        scheme.deck,
                    ]}
                >
                    <Text style={scheme.txt}>{item.name}</Text>
                    {/* <Pressable
                        onLongPress={(event) => handleMenuPress(event, item)}
                        onPress={(event) => handleMenuPress(event, item)}
                    >
                        <Text style={scheme.txt}>MENU</Text>
                    </Pressable> */}
                </View>
            </Pressable>
        );
    };

    // console.log("decklistdata " + JSON.stringify(deckListData));

    return (
        <View style={styles.container}>
            {deckListData.length > 0 && (
                <>
                    <Text style={scheme.txt}>Saved Decks</Text>
                    <FlatList data={deckListData} renderItem={renderItem} />
                </>
            )}
            {deckListData.length < 1 && (
                <Text>No decks in memory, please add a deck</Text>
            )}
            {deckListData.length < MAX_DECKS && (
                <Portal>
                    <FAB.Group
                        open={open}
                        visible
                        icon={"plus"}
                        actions={[
                            {
                                icon: "text",
                                label: "Text",
                                onPress: () => console.log("txt pressed"),
                            },
                            {
                                icon: "table",
                                label: "CSV",
                                onPress: () => console.log("csv pressed"),
                            },
                        ]}
                        onStateChange={onStateChange}
                    />
                </Portal>
            )}
            {deckListData.length >= MAX_DECKS && (
                <FAB
                    icon="plus"
                    style={[styles.fab, { backgroundColor: "grey" }]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        backgroundColor: "#f9f9f9",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    selectedItem: {
        backgroundColor: "#ffcccc",
    },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)" },
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
    menuItem: { paddingVertical: 5, paddingHorizontal: 10, fontSize: 16 },
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
