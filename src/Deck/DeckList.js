import { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    Dimensions,
    Modal,
} from "react-native";
import { useTheme } from "../Providers/ThemeProvider";
import { lightDarkStyles } from "../lib";
import { FAB, Portal } from "react-native-paper";
import { MAX_DECKS, THEMES } from "../constants";
import { getFileData } from "../fileLib";
import * as DocumentPicker from "expo-document-picker";
import { makeNewDeck } from "../Deck/QuizDeck";
import { getRandomInt } from "../util";

export const DeckList = ({
    deckListData,
    onPressDeck,
    onDeleteDeck,
    onAddDeck,
}) => {
    const { width } = Dimensions.get("window");
    const SAFE_WIDTH = width - Math.round(width / 20); // 95% width
    const MODAL_WIDTH = 100; // arbitrary for now

    const [importSource, setImportSource] = useState({
        mimeType: null,
        name: null,
        size: null,
        uri: null,
    });

    // used when deck menu is pressed
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedItem, setSelectedItem] = useState(null);

    const { theme } = useTheme();
    const scheme =
        theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;

    // @todo this is used when fab is clicked, need renaming
    const [state, setState] = useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;

    const unSelectItem = () => {
        setSelectedItem(null);
        setMenuVisible(false);
    };

    const handleModalClickAway = () => {
        unSelectItem();
    };

    const handleMenuPress = (event, item) => {
        const { pageX, pageY } = event.nativeEvent;
        const modalWidth = 100;
        let modalX = Math.max(pageX - modalWidth, 0);
        modalX = Math.min(SAFE_WIDTH - MODAL_WIDTH, modalX);
        setMenuPosition({ top: pageY, left: modalX });
        setSelectedItem(item);
        setMenuVisible(true);
    };

    const handleEdit = () => {
        //console.log(`Edit ${selectedItem?.title}`);
        unSelectItem();
    };

    const handleDelete = () => {
        onDeleteDeck(selectedItem.id);
        unSelectItem();
    };

    const renderItem = ({ item }) => {
        // console.log("item " + JSON.stringify(item));
        return (
            <Pressable
                key={item.id}
                onPress={() => onPressDeck(item.id)}
                onLongPress={(event) => handleMenuPress(event, item)}
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
        } while (
            deckListData.filter((deck) => deck.id === newDeckId).length > 0 &&
            limit < 10
        );
        if (limit >= 10) {
            console.log("loop limit for deck id, last id: " + newDeckId);
            return;
        }

        const newQuestionArray = await getFileData(importSource);
        const newDeck = makeNewDeck(
            newDeckId,
            importSource.name,
            newQuestionArray
        );

        await onAddDeck(newDeck);
    };

    // actions after source specified
    useEffect(() => {
        if (importSource.uri) {
            importDeck(importSource.uri);
        }
    }, [importSource]);

    // console.log("decklistdata " + JSON.stringify(deckListData));

    return (
        <View style={styles.container}>
            {deckListData.length > 0 && (
                <>
                    <Text style={scheme.txt}>Saved Decks</Text>
                    <FlatList data={deckListData} renderItem={renderItem} />

                    {menuVisible && (
                        <Modal
                            transparent
                            animationType="fade"
                            visible={menuVisible}
                        >
                            <Pressable
                                style={styles.overlay}
                                onPress={() => handleModalClickAway()}
                            >
                                <View
                                    style={[
                                        styles.menu,
                                        {
                                            top: menuPosition.top,
                                            left: menuPosition.left,
                                        },
                                    ]}
                                >
                                    {/*<Pressable onPress={handleEdit}>
                    <Text style={styles.menuItem}>Edit</Text>
                  </Pressable>*/}
                                    <Pressable onPress={handleDelete}>
                                        <Text style={styles.menuItem}>
                                            Delete
                                        </Text>
                                    </Pressable>
                                </View>
                            </Pressable>
                        </Modal>
                    )}
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
