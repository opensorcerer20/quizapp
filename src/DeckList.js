import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useTheme } from "./ThemeProvider";
import { lightDarkStyles } from "./lib";
import { FAB, Portal } from "react-native-paper";
import { DECK_DATA_KEY, THEMES } from "./constants";
import { getFileData } from "./fileLib";
import * as DocumentPicker from 'expo-document-picker';
import { makeNewDeck } from "./QuizDeck";
import { getRandomInt } from "./util";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MAX_DECKS = 50;

export const DeckList = ({ deckListData, onPressDeck, onDelete, onLoadDeck }) => {
    const [importSource, setImportSource] = useState({
        mimeType: null,
        name: null,
        size: null,
        uri: null,
        deckId: null,
    });

    // used when deck menu is pressed
    const [selectedItem, setSelectedItem] = useState(null); 
    
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

    const onPressImport = async (type) => {
        const fileType = type === "csv" ? "text/csv" : "text/plain";
        try {
            const docRes = await DocumentPicker.getDocumentAsync({
                type: fileType,
            });

            setImportSource(docRes.assets[0]);
        } catch (error) {
            console.log(
                "Error while selecting text file: ",
                JSON.stringify(error)
            );
        }
    };

    const importDeck = async () => {
        let newDeckId;
        let limit = 0;
        do {
            newDeckId = getRandomInt(100000, 999999);
            limit++;
        } while (deckListData.filter(deck => deck.id === newDeckId).length > 0 && limit < 10);
        if (limit >= 10) {
            console.log('loop limit for deck id, last id: ' + newDeckId);
            return;
        }

        const newQuestionArray = await getFileData(importSource);
        const newDeck = makeNewDeck(newDeckId, importSource.name, newQuestionArray);
        let newDeckListData = deckListData.slice();
        newDeckListData.push(newDeck);

        await saveNewDeckListData(newDeckListData);
        
        // signal parent to reload deck list from memory
        onLoadDeck();
    };

    const saveNewDeckListData = async (newDeckListData) => {
        try {
            await AsyncStorage.setItem(
              DECK_DATA_KEY,
              JSON.stringify(newDeckListData),
            );
        } catch (error) {
            console.log(
                "error saving deck list data, error keys " + JSON.stringify(Object.keys(error))
            );
        }
    }

    // actions after source specified
    useEffect(() => {
        if (importSource.uri) {
            importDeck(importSource.uri);
        }
    }, [importSource]);

    // use to clear memory
    //useEffect(() => {
    //    saveNewDeckListData([]);
    //}, []);

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
