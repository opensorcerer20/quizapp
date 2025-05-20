import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { lightDarkStyles } from "./lib";
import QuizScreen from "./Quiz/QuizScreen";
import Toolbar from "./Toolbar";
import { DeckList } from "./Deck/DeckList";
import { useTheme } from "./Providers/ThemeProvider";
import { DECK_DATA_KEY, THEMES, VIEWS } from "./constants";
import { getStaticData } from "./Deck/QuizDeck";
import { loadStorageData, saveStorageData } from "./fileLib";

export default QuizApp = () => {
    const USE_STATIC_DATA = false;
    const { theme } = useTheme();
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
            let newDeckListData = await loadStorageData(DECK_DATA_KEY);
            newDeckListData.sort((a, b) => b.createdAt - a.createdAt);
            setDeckListData(newDeckListData);
            setReload(false);
        }
    };

    const onAddDeck = async (newDeck) => {
        let newDeckListData = deckListData.slice();
        newDeckListData.push(newDeck);
        await saveDeckListData(newDeckListData);
    };

    const saveDeckListData = async (deckListData) => {
        const result = await saveStorageData(DECK_DATA_KEY, deckListData);
        if (result === true) {
            setReload(true);
        }
    };

    const onDeleteDeck = async (deckId) => {
        const newDeckListData = deckListData.filter(
            (deckDatum) => deckDatum.id !== deckId
        );
        setDeckListData(newDeckListData);
        saveDeckListData(newDeckListData);
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

    // use to clear memory
    //useEffect(() => {
    //    saveDeckListData([]);
    //}, []);

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
