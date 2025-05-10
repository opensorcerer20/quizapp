import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { schemes } from "./lib";
import QuizScreen from "./QuizScreen";
import Toolbar from "./Toolbar";
import { DeckList } from "./DeckList";
import { addQuestionToDeck, makeNewDeck } from "./QuizDeck";

let staticDeckListData = [makeNewDeck(1, "deck one")];
addQuestionToDeck(staticDeckListData[0], 1, "question 1", "answer 1");
addQuestionToDeck(staticDeckListData[0], 2, "question 2", "answer 2");
addQuestionToDeck(staticDeckListData[0], 3, "question 3", "answer 3");

export default App = () => {
    //const colorScheme = useColorScheme();
    const colorScheme = "light";
    const [deckListData, setDeckListData] = useState([]);
    const [currentDeck, setCurrentDeck] = useState([]);

    //console.log('deckListData: ' + JSON.stringify(deckListData));

    const scheme =
        colorScheme === "dark" ? styles.schemeDark : styles.schemeLight;

    const clearDeck = () => {
        setCurrentDeck([]);
    };

    const onPressDeck = (id) => {
        const selectedDeck = deckListData.find((deck) => deck.id === id);
        if (selectedDeck) {
            setCurrentDeck(selectedDeck);
        } else {
            clearDeck();
        }
    };

    const loadDeckListData = async () => {
        try {
            // const value = await AsyncStorage.getItem(DATA_STORAGE_KEY);
            value = staticDeckListData;
            if (value !== null) {
                //console.log('loading: ' + JSON.stringify(value));
                setDeckListData(value);
            }
        } catch (e) {
            console.log("error loading deck list data");
            // error reading value
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await loadDeckListData();
        };
        loadData();
    }, []);

    const currentView = !!currentDeck.data?.length ? "quizView" : "homeView";

    // console.log(
    //     "quizapp state " + JSON.stringify({ deckListData, currentDeck })
    // );

    return (
        <View style={[styles.container, scheme.bg]}>
            <Toolbar
                style={styles.toolbarContainer}
                showBack={!!currentDeck.data?.length}
                title={"@TODO deck name goes here"}
                backCallback={clearDeck}
                colorScheme={colorScheme}
            />
            {currentView === "quizView" && (
                <QuizScreen
                    currentDeck={currentDeck}
                    colorScheme={colorScheme}
                />
            )}
            {currentView === "homeView" && (
                <DeckList
                    deckListData={deckListData}
                    onPressDeck={onPressDeck}
                />
            )}
            <StatusBar style="dark" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        //marginTop: 50,
    },
    toolbarContainer: {
        flex: 1,
    },
    insideContainer: {
        flex: 10,
    },
    ...schemes,
});
