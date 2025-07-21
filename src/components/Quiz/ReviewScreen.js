import { useEffect, useState } from "react";

import { difference } from "lodash";
import { Platform, StyleSheet, Text, View } from "react-native";

import { TUTORIAL_SHOWN_KEY } from "../../common/constants";
import { checkIfExists, setFlag } from "../../common/fileLib";
import { getRandomInt, getScheme } from "../../common/util";
import { DeckNav } from "../Deck/DeckNav";
import DeckTitle from "../Deck/DeckTitle";
import FlipCard from "../Deck/FlipCard";
import { emptyQuestion, randomizeQBag } from "../Deck/QuizDeck";
import { useTheme } from "../Providers/ThemeProvider";
import { StyledSwitch } from "../StyledSwitch";
import TutorialModal from "../TutorialModal";

export const ReviewScreen = ({ currentDeck, currentDeckQuestionData, updateQuestionData }) => {
  const [isReversed, setIsReversed] = useState(false);
  const [noEnabledQs, setNoEnabledQs] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

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
      setNoEnabledQs(true);
    }
  };

  const onEnableSwitchClick = (id, isNowDisabled) => {
    // avoid issue where there are no questions
    if (currentDeckQuestionData.length > 1) {
      const newBag = currentDeckQuestionData.map((question) => {
        if (question.id === id) {
          return { ...question, disabled: !!isNowDisabled };
        }
        return question;
      });
      updateQuestionData(currentDeck.id, newBag);
    }
  };

  const dismissTutorial = (value) => {
    setShowTutorial(value);
    setFlag(TUTORIAL_SHOWN_KEY, true);
  };

  const hasQuestionData = !noEnabledQs && !!currentState.currentQuestion.q;
  const currentQuestionStateFilter = currentState?.currentQuestion?.id
    ? currentDeckQuestionData.filter((question) => question.id === currentState.currentQuestion.id)
    : [];
  const currentQuestionState = currentQuestionStateFilter.length === 1 ? currentQuestionStateFilter[0] : null;

  // initial run, go ahead and reset question bag
  useEffect(() => {
    if (currentDeck && Array.isArray(currentDeckQuestionData) && currentDeckQuestionData.length > 0) {
      resetQuestionBag(true);
    }
    const asyncCall = async () => {
      const value = await checkIfExists(TUTORIAL_SHOWN_KEY);
      setShowTutorial(!value);
    };
    asyncCall();
  }, []);

  // console.log("showtutorial " + JSON.stringify(showTutorial));

  return (
    <>
      {hasQuestionData && (
        <View style={[styles.container]}>
          <DeckTitle deckName={currentDeck.name} scheme={scheme} />
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
          <Text style={[scheme.txt, styles.cardCounter]}>
            Card {currentState.originalBag.length - currentState.questionBag.length} of{" "}
            {currentState.originalBag.length}
          </Text>
          <View style={styles.switchContainer}>
            <StyledSwitch
              theme={theme}
              txtStyle={[scheme.txt, { fontWeight: "bold" }]}
              optionValue={isReversed}
              onClick={() => setIsReversed(!isReversed)}
              labelTxt={"Reverse Q & A"}
            />
          </View>
          <View style={styles.switchContainer}>
            <StyledSwitch
              theme={theme}
              txtStyle={[scheme.txt, { fontWeight: "bold" }]}
              optionValue={
                currentQuestionState ? !!currentQuestionState.disabled : !!currentState.currentQuestion.disabled
              }
              onClick={() =>
                onEnableSwitchClick(
                  currentState.currentQuestion.id,
                  currentQuestionState ? !currentQuestionState.disabled : !currentState.currentQuestion.disabled
                )
              }
              labelTxt={"Turn card off"}
            />
          </View>
        </View>
      )}
      {!hasQuestionData && <DeckTitle deckName={currentDeck.name} scheme={scheme} />}
      {noEnabledQs && (
        <View style={styles.container}>
          <View style={[scheme.bgAntiPrimary, styles.noQContainer]}>
            <Text style={styles.noQText}>Sorry, no questions are enabled for this deck.</Text>
            <Text style={styles.noQText}>
              Please go to the deck View from the main Deck List and enable at least one card from this deck.
            </Text>
          </View>
        </View>
      )}
      <TutorialModal showModal={showTutorial} setShowModal={dismissTutorial} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  noQContainer: {
    width: "95%",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: "auto",
  },
  noQText: {
    marginBottom: 10,
    fontSize: 16,
  },
  switchContainer: { margin: 0, padding: Platform.OS === "ios" ? 5 : 0 },
  cardCounter: {
    margin: "auto",
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 10,
  },
});
