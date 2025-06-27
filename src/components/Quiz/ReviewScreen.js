import { useEffect, useState } from "react";

import { difference } from "lodash";
import { Platform, StyleSheet, Text, View } from "react-native";

import { getRandomInt, getScheme } from "../../common/util";
import { DeckNav } from "../Deck/DeckNav";
import FlipCard from "../Deck/FlipCard";
import { emptyQuestion, randomizeQBag } from "../Deck/QuizDeck";
import { StyledSwitch } from "../Deck/StyledSwitch";
import { useTheme } from "../Providers/ThemeProvider";

export const ReviewScreen = ({ currentDeck, currentDeckQuestionData, updateQuestionData }) => {
  const [isReversed, setIsReversed] = useState(false);
  const { theme } = useTheme();
  const scheme = getScheme(theme);

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
    // avoid issue where there are no questions
    if (currentDeckQuestionData.length > 1) {
      const newBag = currentDeckQuestionData.map((question) => {
        if (question.id === id) {
          return { ...question, disabled: true };
        }
        return question;
      });
      updateQuestionData(currentDeck.id, newBag);
    }
  };

  const hasQuestionData = !!currentState.currentQuestion.q;
  const currentQuestionStateFilter = currentState?.currentQuestion?.id
    ? currentDeckQuestionData.filter((question) => question.id === currentState.currentQuestion.id)
    : [];
  const currentQuestionState = currentQuestionStateFilter.length === 1 ? currentQuestionStateFilter[0] : null;

  // initial run, go ahead and reset question bag
  useEffect(() => {
    if (currentDeck && Array.isArray(currentDeckQuestionData) && currentDeckQuestionData.length > 0) {
      resetQuestionBag(true);
    }
  }, []);

  // console.log("state " + JSON.stringify({ currentDeck, currentDeckQuestionData }));

  return (
    <>
      {hasQuestionData && (
        <View style={[styles.container]}>
          <View style={{ paddingBottom: Platform.OS === "ios" ? 10 : 0 }}>
            <StyledSwitch
              theme={theme}
              txtStyle={[scheme.txt, { fontWeight: "bold" }]}
              optionValue={isReversed}
              onClick={() => setIsReversed(!isReversed)}
              labelTxt={"Reverse Q & A"}
            />
          </View>
          <View style={{ paddingBottom: Platform.OS === "ios" ? 5 : 0 }}>
            <StyledSwitch
              theme={theme}
              txtStyle={[scheme.txt, { fontWeight: "bold" }]}
              optionValue={
                currentQuestionState ? !currentQuestionState.disabled : !currentState.currentQuestion.disabled
              }
              onClick={() => disableQuestion(currentState.currentQuestion.id)}
              labelTxt={"Card Enabled"}
            />
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
});
