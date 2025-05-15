import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { lightDarkStyles } from "./lib";
import QuizScreen from "./QuizScreen";
import Toolbar from "./Toolbar";
import { DeckList } from "./DeckList";
import { makeNewDeck, makeQuestionObject } from "./QuizDeck";
import { useTheme } from "./ThemeProvider";
import { THEMES, VIEWS } from "./constants";

/* TESTING */
const staticDeckListData = [];
for (let i = 1; i < 50; i++) {
    staticDeckListData.push(
        makeNewDeck(i, `deck ${i}`, [
            makeQuestionObject(1, `deck ${i} question 1`, `deck ${i} answer 1`),
            makeQuestionObject(2, `deck ${i} question 2`, `deck ${i} answer 2`),
            makeQuestionObject(3, `deck ${i} question 3`, `deck ${i} answer 3`),
            makeQuestionObject(
                4,
                `deck ${i} ` + "MW".repeat(200),
                "MW".repeat(200)
            ),
        ])
    );
}
/* END TESTING */

export default QuizApp = () => {
    const { theme, toggleTheme } = useTheme();
    const [deckListData, setDeckListData] = useState([]);
    const [currentDeck, setCurrentDeck] = useState([]);

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
        try {
            value = staticDeckListData;
            if (value !== null) {
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

    const currentView = !!currentDeck.data?.length
        ? VIEWS.quizView
        : VIEWS.homeView;

    // console.log("quizapp state " + JSON.stringify({ colorScheme }));

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
