import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { lightDarkStyles } from "./lib";
import QuizScreen from "./QuizScreen";
import Toolbar from "./Toolbar";
import { DeckList } from "./DeckList";
import { useTheme } from "./ThemeProvider";
import { DECK_DATA_KEY, THEMES, VIEWS } from "./constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStaticData } from "./QuizDeck";

export default QuizApp = () => {
    const USE_STATIC_DATA = false;
    const { theme, toggleTheme } = useTheme();
    const [deckListData, setDeckListData] = useState([]);
    const [currentDeck, setCurrentDeck] = useState([]);
    const [reload, setReload] = useState(false);

    const scheme =
        theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;

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
        if (USE_STATIC_DATA) {
            setDeckListData(getStaticData());
        } else {
            try {
                const value = await AsyncStorage.getItem(DECK_DATA_KEY);
                if (value !== null) {
                    //console.log('loading: ' + JSON.stringify(value));
                    let newDeckListData = JSON.parse(value);
                    newDeckListData.sort((a, b) => b.createdAt - a.createdAt);
                    // console.log("setting decklist");
                    setDeckListData(newDeckListData);
                    setReload(false);
                }
            } catch (e) {
                console.log(
                    "error loading deck list data, error keys " +
                        JSON.stringify(Object.keys(e))
                );
            }
        }
    };

    const onAddDeck = async (newDeck) => {
        let newDeckListData = deckListData.slice();
        newDeckListData.push(newDeck);
        await saveNewDeckListData(newDeckListData);
    };

    const saveNewDeckListData = async (newDeckListData) => {
        try {
            await AsyncStorage.setItem(
                DECK_DATA_KEY,
                JSON.stringify(newDeckListData)
            );
            setReload(true);
        } catch (error) {
            console.log(
                "error saving deck list data, error keys " +
                    JSON.stringify(Object.keys(error))
            );
        }
    };

    const onDeleteDeck = async (deckId) => {
        const newDeckListData = deckListData.filter(
            (deckDatum) => deckDatum.id !== deckId
        );
        setDeckListData(newDeckListData);
        saveNewDeckListData(newDeckListData);
    };

    // load data if either first time or reload is tripped
    useEffect(() => {
        // console.log("useeffect reload: " + reload);
        if (reload) {
            const loadData = async () => {
                await loadDeckListData();
            };
            loadData();
        }
    }, [reload]);

    // load data first time
    useEffect(() => {
        const loadData = async () => {
            await loadDeckListData();
        };
        loadData();
    }, []);

    const currentView = !!currentDeck.data?.length
        ? VIEWS.quizView
        : VIEWS.homeView;

    // console.log("quizapp state " + JSON.stringify({ deckListData }));

    return (
        <View style={[styles.container, scheme.bg, scheme.txt]}>
            <Toolbar
                style={styles.toolbarContainer}
                currentView={currentView}
                title={currentDeck.name || ""}
                backCallback={clearDeck}
            />
            {currentView === VIEWS.quizView && (
                <QuizScreen currentDeck={currentDeck} />
            )}
            {currentView === VIEWS.homeView && (
                <DeckList
                    deckListData={deckListData}
                    onPressDeck={onPressDeck}
                    onAddDeck={onAddDeck}
                    onDeleteDeck={onDeleteDeck}
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
    ...lightDarkStyles,
});
