import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useTheme } from "./ThemeProvider";
import { schemes } from "./lib";

export const DeckList = ({ deckListData, onPressDeck, onDelete }) => {
    const [selectedItem, setSelectedItem] = useState(null); // used when menu is pressed to show which was selected
    const { theme } = useTheme();
    const scheme = theme === "dark" ? styles.schemeDark : styles.schemeLight;

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
                    <Pressable
                        onLongPress={(event) => handleMenuPress(event, item)}
                        onPress={(event) => handleMenuPress(event, item)}
                    >
                        <Text style={scheme.txt}>MENU</Text>
                    </Pressable>
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
                <Text style={scheme.txt}>
                    No decks in memory, please add a deck
                </Text>
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
    ...schemes,
});

export default DeckList;
