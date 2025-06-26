import { useEffect, useState } from "react";

import { difference } from "lodash";
import { StyleSheet, Text, View } from "react-native";

import { THEMES } from "../../common/constants";
import { lightDarkStyles } from "../../common/lib";
import { getRandomInt } from "../../common/util";
import { DeckNav } from "../Deck/DeckNav";
import FlipCard from "../Deck/FlipCard";
import { emptyQuestion, randomizeQBag } from "../Deck/QuizDeck";
import { ReverseDeckButton } from "../Deck/ReverseDeckButton";
import { useTheme } from "../Providers/ThemeProvider";

export const ReviewScreen = ({ currentDeck, currentDeckQuestionData }) => {
  const [isReversed, setIsReversed] = useState(false);
  const { theme } = useTheme();

  const scheme = theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;
  const [currentState, setCurrentState] = useState({
    originalBag: [],
    questionBag: [],
    currentQuestion: emptyQuestion,
  });

  const prevQuestion = () => {
    if (currentState.originalBag.length - currentState.questionBag.length >= 2) {
      // get questions already run through
      const diff = difference(currentState.originalBag, currentState.questionBag);

      // put current question back on stack
      const newBag = currentState.questionBag.slice();
      newBag.unshift(diff[diff.length - 1]);

      // put previous question as current
      setCurrentState({
        ...currentState,
        questionBag: newBag,
        currentQuestion: diff[diff.length - 2],
      });
    }
  };

  // if bag passed in, use it, otherwise use currentState bags
  const nextQuestion = (incomingBag = null) => {
    const originalBag = incomingBag ? incomingBag.slice() : currentState.originalBag;
    const currentBag = incomingBag ?? currentState.questionBag.slice();

    // @todo need to handle zero enabled cards

    if (currentBag.length > 0) {
      const questionBag = currentBag.slice(1);
      const currentQuestion = currentBag.shift();
      setCurrentState({
        originalBag,
        questionBag,
        currentQuestion,
      });
    } else {
      resetQuestionBag(true);
    }
  };

  const resetQuestionBag = (remix = false) => {
    let newBag = remix ? currentDeckQuestionData.slice() : currentState.originalBag.slice();
    newBag = newBag.filter((question) => !question?.disabled);
    if (newBag.length > 0) {
      if (remix) {
        newBag = randomizeQBag(newBag);
      }
      nextQuestion(newBag);
    } else {
      // @todo
      console.log("modal to go back");
    }
  };

  const disableQuestion = (id) => {
    // make copy of currentDeckQuestionData
    // set question with id to disabled
    // save copy of currentDeckQuestionData
  };

  const hasQuestionData = !!currentState.currentQuestion.q;

  // initial run, go ahead and reset question bag
  useEffect(() => {
    if (currentDeck && Array.isArray(currentDeckQuestionData) && currentDeckQuestionData.length > 0) {
      resetQuestionBag(true);
    }
  }, [currentDeck, currentDeckQuestionData]);

  // console.log("state " + JSON.stringify({ currentState, hasQuestionData }));

  return (
    <>
      {hasQuestionData && (
        <View style={[styles.container]}>
          <ReverseDeckButton
            txtStyle={[scheme.txt, { fontWeight: "bold" }]}
            isReversed={isReversed}
            onClick={() => setIsReversed(!isReversed)}
          />
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
            Card {currentState.originalBag.length - currentState.questionBag.length} of{" "}
            {currentState.originalBag.length}
          </Text>
          <FlipCard
            key={getRandomInt(100000, 999999)}
            questionText={currentState.currentQuestion.q}
            answerText={currentState.currentQuestion.a}
            isReversed={isReversed}
          />
          <DeckNav
            prevEnabled={currentState.originalBag.length - currentState.questionBag.length > 1}
            onPrevClick={prevQuestion}
            nextEnabled={!!currentState.questionBag.length}
            onNextClick={nextQuestion}
            onResetClick={() => resetQuestionBag(true)}
            onStartOverClick={() => resetQuestionBag(false)}
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
