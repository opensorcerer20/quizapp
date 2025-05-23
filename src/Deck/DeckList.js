import { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    Dimensions,
    Modal,
    Alert,
    TextInput,
} from "react-native";
import { useTheme } from "../Providers/ThemeProvider";
import { lightDarkStyles } from "../lib";
import { FAB, Portal } from "react-native-paper";
import { MAX_DECKS, THEMES } from "../constants";
import { getFileData } from "../fileLib";
import * as DocumentPicker from "expo-document-picker";
import { emptyDeck, makeNewDeck, makeNewDeckData } from "../Deck/QuizDeck";
import { getRandomInt } from "../util";
import QuizModal from "../components/QuizModal";

export const DeckList = ({
    deckListData,
    onPressDeck,
    onDeleteDeck,
    onAddDeck,
    onUpdateDeck,
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
    const [editingDeck, setEditingDeck] = useState(emptyDeck);
    const [deckName, setDeckName] = useState("");

    const [editModalVisible, setEditModalVisible] = useState(false);

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

    const handleEditClick = () => {
        console.log("edit " + JSON.stringify(selectedItem));
        const selected = deckListData.filter(
            (deck) => deck.id === selectedItem.id
        );
        if (selected.length === 1) {
            setEditingDeck(selected[0]);
            setDeckName(selectedItem.name);
            setEditModalVisible(true);
            setMenuVisible(false);
        } else {
            console.log("Error editing deck with id " + selectedItem.id);
        }
    };

    const handleDeleteClick = () => {
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
        const [newDeckName] = importSource.name.split(".");
        const newDeck = makeNewDeck(newDeckId, newDeckName);
        const newDeckData = makeNewDeckData(newDeckId, newQuestionArray);

        await onAddDeck(newDeck, newDeckData);

        // @todo this is too big for useState
        setEditingDeck(newDeck);
        setDeckName(newDeckName);
        setEditModalVisible(true);
    };

    const handleCancelClick = () => {
        setEditModalVisible(false);
        setEditingDeck(emptyDeck);
        setDeckName("");
        setSelectedItem(null);
    };

    const handleRenameDeck = (deckId, name) => {
        // @todo this is too big for useState
        onUpdateDeck(deckId, { name });
        handleCancelClick();
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

                    {/* edit modal */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={editModalVisible}
                        onRequestClose={() => {
                            setEditModalVisible(false);
                        }}
                    >
                        <View style={[styles.centeredView, styles.overlay]}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>
                                    <TextInput
                                        placeholder={editingDeck.name}
                                        onChangeText={setDeckName}
                                        value={deckName}
                                    />
                                </Text>
                                <Pressable
                                    style={[
                                        styles.button,
                                        styles.buttonClose,
                                        { backgroundColor: "grey" },
                                    ]}
                                    onPress={handleCancelClick}
                                >
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() =>
                                        handleRenameDeck(
                                            editingDeck.id,
                                            deckName
                                        )
                                    }
                                >
                                    <Text style={styles.textStyle}>Submit</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>

                    <QuizModal
                        modalVisible={menuVisible}
                        handleModalClickAway={handleModalClickAway}
                        modalContainerStyle={[
                            styles.menu,
                            {
                                top: menuPosition.top,
                                left: menuPosition.left,
                            },
                        ]}
                    >
                        <Pressable onPress={handleEditClick}>
                            <Text style={styles.menuItem}>Edit</Text>
                        </Pressable>
                        <Pressable onPress={handleDeleteClick}>
                            <Text style={styles.menuItem}>Delete</Text>
                        </Pressable>
                    </QuizModal>
                </>
            )}
            {deckListData.length < 1 && (
                <Text style={scheme.txt}>
                    No decks in memory, please add a deck
                </Text>
            )}
            {deckListData.length < MAX_DECKS && (
                // this is broken for iphone, specifically fab.group
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
                // <FAB
                //     icon="plus"
                //     style={[styles.fab]}
                //     onPress={() => onPressImport("txt")}
                // />
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

    // start copy/paste styles
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    // end copy/paste styles

    ...lightDarkStyles,
});

export default DeckList;
