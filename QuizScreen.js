import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { schemes } from "./lib";
import FlipCard from "./FlipCard";

export const emptyQuestion = {
  q: null,
  a: null,
};

export const QuizScreenOrder = {
  BAG_RANDOM: "BAG_RANDOM",
  ALL_RANDOM: "ALL_RANDOM",
  SEQUENTIAL: "SEQUENTIAL"
};

const QuizScreen = ({
    colorScheme = "light",
    currentDeck,
    questionOrder = QuizScreenOrder.BAG_RANDOM,
}) => {
    const [currentState, setCurrentState] = useState({questionBag: [], currentQuestion: emptyQuestion });

    const nextQuestion = (incomingBag = null) => {
      const currentBag = incomingBag ?? currentState.questionBag;
        if (currentBag.length) {
          if (questionOrder === QuizScreenOrder.BAG_RANDOM || questionOrder === QuizScreenOrder.SEQUENTIAL) {
            // shift quesiton off
            // setCurrentQuestion(currentBag.shift());
            // setQuestionBag(currentBag.slice(1));
            setCurrentState({questionBag: currentBag.slice(1), currentQuestion: currentBag.shift()}); 
          } else if (questionOrder === QuizScreenOrder.ALL_RANDOM) {
            // @todo pick a random item, do not pop off
          }
        } else {
          resetQuestionBag();
        }
    }

    const resetQuestionBag = () => {
      // currentDeck shouldnt be modified without cloning, but it is for some reason
      let newBag = JSON.parse(JSON.stringify(currentDeck));
        // fill bag with questions randomized according to settings
        if (questionOrder === QuizScreenOrder.ALL_RANDOM || questionOrder === QuizScreenOrder.BAG_RANDOM) {
          // randomize questions
          // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#46545530

          newBag = newBag
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        }

        nextQuestion(newBag);
    };

    const hasQuestionData = !!currentState.currentQuestion.q;

    useEffect(() => {
      if (hasQuestionData) {
        resetQuestionBag();
      }
    }, [currentDeck])

    useEffect(() => {
      if (currentDeck && Array.isArray(currentDeck) && currentDeck.length > 0) {
        resetQuestionBag();
      }
    }, [])

    return (
        <>
            {hasQuestionData && (
                <View style={styles.container}>
                  <FlipCard
                      questionText={currentState.currentQuestion.q}
                      answerText={currentState.currentQuestion.a}
                      nextQuestion={nextQuestion}
                    />
                  <Text>num left {currentState.questionBag.length}</Text>
                </View>
            )}
            {!hasQuestionData && (
                <View><Text>No deck data</Text></View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    ...schemes
});

export default QuizScreen;
