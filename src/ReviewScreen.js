import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { lightDarkStyles } from "./lib";
import FlipCard from "./FlipCard";
import { getRandomInt } from "./util";
import { emptyQuestion, randomizeQBag } from "./QuizDeck";
import { useTheme } from "./ThemeProvider";
import { THEMES } from "./constants";
import { Button } from "react-native-paper";
import { difference } from "lodash";

export const ReviewScreen = ({ currentDeck }) => {
    const [isReversed, setIsReversed] = useState(false);
    const { theme } = useTheme();
    const scheme =
        theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;
    const [currentState, setCurrentState] = useState({
        originalBag: [],
        questionBag: [],
        currentQuestion: emptyQuestion,
    });

    const prevQuestion = () => {
        // get length of current bag
        // count backwards from end of original bag
        // unshift current question to bag
        // set prev question
        /*
        original
        [1, 2, 3, 4, 5]
        current
        [3, 4, 5]
        currq
    [2]
        get diff
        [1, 2]
        current.unshift(2)
        currq = 1
        */
        if (
            currentState.originalBag.length - currentState.questionBag.length >=
            2
        ) {
            const diff = difference(
                currentState.originalBag,
                currentState.questionBag
            );
            const newBag = currentState.questionBag.slice();
            newBag.unshift(diff[diff.length - 1]);
            setCurrentState({
                ...currentState,
                questionBag: newBag,
                currentQuestion: diff[diff.length - 2],
            });
        }
    };

    const nextQuestion = (incomingBag = null) => {
        const originalBag = incomingBag
            ? incomingBag.slice()
            : currentState.originalBag;
        const currentBag = incomingBag ?? currentState.questionBag.slice();
        if (currentBag.length) {
            const questionBag = currentBag.slice(1);
            const currentQuestion = currentBag.shift();
            setCurrentState({
                originalBag,
                questionBag,
                currentQuestion,
            });
        } else {
            resetQuestionBag();
        }
    };

    const resetQuestionBag = () => {
        let newBag = JSON.parse(JSON.stringify(currentDeck.data));

        newBag = randomizeQBag(newBag);

        nextQuestion(newBag);
    };

    const hasQuestionData = !!currentState.currentQuestion.q;

    // if deck changes, reset question bag
    useEffect(() => {
        if (hasQuestionData) {
            resetQuestionBag();
        }
    }, [currentDeck]);

    // initial run, go ahead and reset question bag
    useEffect(() => {
        if (
            currentDeck &&
            Array.isArray(currentDeck.data) &&
            currentDeck.data.length > 0
        ) {
            resetQuestionBag();
        }
    }, []);

    const prevEnabled =
        currentState.originalBag.length - currentState.questionBag.length > 1;
    const prevButton = (
        <Button
            style={{ marginTop: 10 }}
            buttonColor={prevEnabled ? "#0000ff" : "#999999"}
            textColor="#e0e0e0"
            onPress={prevEnabled ? () => prevQuestion() : () => {}}
        >
            &lt; Previous
        </Button>
    );

    const nextEnabled = !!currentState.questionBag.length;
    const nextButton = (
        <Button
            style={{ marginTop: 10 }}
            buttonColor={nextEnabled ? "#0000ff" : "#999999"}
            textColor="#e0e0e0"
            onPress={nextEnabled ? () => nextQuestion() : () => {}}
        >
            Next &gt;
        </Button>
    );

    // console.log("state " + JSON.stringify({ currentState }));

    return (
        <>
            {hasQuestionData && (
                <View style={styles.container}>
                    <View style={{ margin: "auto" }}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isReversed ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setIsReversed(!isReversed)}
                            value={isReversed}
                        />
                    </View>
                    <View style={{ width: 100, margin: "auto" }}>
                        <Pressable
                            onPress={() => setIsReversed(!isReversed)}
                            onLongPress={() => setIsReversed(!isReversed)}
                        >
                            <Text>Reverse Q & A</Text>
                        </Pressable>
                    </View>
                    <Text
                        style={[
                            scheme.txt,
                            {
                                margin: "auto",
                                fontSize: 16,
                                fontWeight: "bold",
                                padding: 5,
                            },
                        ]}
                    >
                        Card{" "}
                        {currentDeck.data.length -
                            currentState.questionBag.length}{" "}
                        of {currentDeck.data.length}
                    </Text>
                    <FlipCard
                        key={getRandomInt(100000, 999999)}
                        questionText={currentState.currentQuestion.q}
                        answerText={currentState.currentQuestion.a}
                        isReversed={isReversed}
                    />
                    {prevButton}
                    {nextButton}
                    <Button
                        style={{ marginTop: 10 }}
                        buttonColor="#0000ff"
                        textColor="#e0e0e0"
                        onPress={resetQuestionBag}
                    >
                        &lt;-- Start over
                    </Button>
                </View>
            )}
            {!hasQuestionData && (
                <View>
                    <Text style={scheme.txt}>No deck data</Text>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    ...lightDarkStyles,
});
