import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { lightDarkStyles } from "./lib";
import FlipCard from "./FlipCard";
import { getRandomInt } from "./util";
import { emptyQuestion } from "./QuizDeck";
import { useTheme } from "./ThemeProvider";

const QuizScreen = ({ currentDeck }) => {
    const { theme } = useTheme();
    const scheme = theme === "dark" ? styles.schemeDark : styles.schemeLight;
    const [currentState, setCurrentState] = useState({
        questionBag: [],
        currentQuestion: emptyQuestion,
    });

    const nextQuestion = (incomingBag = null) => {
        const currentBag = incomingBag ?? currentState.questionBag;
        if (currentBag.length) {
            setCurrentState({
                questionBag: currentBag.slice(1),
                currentQuestion: currentBag.shift(),
            });
        } else {
            resetQuestionBag();
        }
    };

    const resetQuestionBag = () => {
        // currentDeck shouldnt be modified without cloning, but it is for some reason
        let newBag = JSON.parse(JSON.stringify(currentDeck.data));
        // fill bag with questions randomized according to settings
        // randomize questions
        // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#46545530

        newBag = newBag
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        nextQuestion(newBag);
    };

    const hasQuestionData = !!currentState.currentQuestion.q;

    useEffect(() => {
        if (hasQuestionData) {
            resetQuestionBag();
        }
    }, [currentDeck]);

    useEffect(() => {
        if (
            currentDeck &&
            Array.isArray(currentDeck.data) &&
            currentDeck.data.length > 0
        ) {
            resetQuestionBag();
        }
    }, []);

    const buttonText = currentState.questionBag.length
        ? "Next Card >"
        : "Start Over";

    return (
        <>
            {hasQuestionData && (
                <View style={styles.container}>
                    <Text
                        style={[
                            scheme.txt,
                            {
                                margin: "auto",
                                fontSize: "16px",
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
                        nextQuestion={nextQuestion}
                        buttonText={buttonText}
                    />
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

export default QuizScreen;
