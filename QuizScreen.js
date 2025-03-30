import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { schemes } from "./lib";
//import { useSharedValue } from "react-native-reanimated";
import { Button } from "react-native-paper";
// import {cleanDeckSettings} from "./QuizDeck";
// import {makeQuestionObject} from "./util";
import { FlipCard } from "./FlipCard";
//import QuizSettings from "./QuizSettings";

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
    // deckSettings = cleanDeckSettings(null, null, null),
    // updateDeckSettings = () => {}
}) => {
    //const showAnswer = useSharedValue(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [questionBag, setQuestionBag] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(emptyQuestion);
/*
deck clicked
- response
  - load question data from file
    - use uri from clicked deck to load questions
  - random sorting of questions
    - make a "bag" of questions
    - randomly sort questions
  - show first question on a card
    - pop first question from bag array
    - (now) viewing question
- implementation thoughts
  - maybe useeffect when currentDeck changes
    - calls fillQuestionBag()
    - this same function will be called when bag empty

^^^ this means deck is randomized in parent according to settings
vvv might not have to randomize in parent, just pass q & a

*** what does deckListData actually represent?
- deckListData is actually "deck list data"

viewing question
- response
  - show ui
    - back button
    - question card
    - next question button

question showing, card clicked
- response
  - flip card to show answer

answer showing, card clicked
- response
  - flip card to show question

next button clicked, > 0 questions left
- response
  - pop question from bag array
  - (now) viewing question

next button clicked, 0 questions left
- response
  - calls fillQuestionBag()
  - shows the first question after re-randomizing questions

NEW THING
- when currentDeck changes, empty question bag
- if question bag empty, fill

*/
    const nextQuestion = (incomingBag = null) => {
      // console.log('incoming ' + JSON.stringify(incomingBag))
      // console.log('questionBag ' + JSON.stringify(questionBag))
      const currentBag = incomingBag ?? questionBag;
      // console.log('currentBag ' + JSON.stringify(currentBag))
        if (currentBag.length) {
          if (questionOrder === QuizScreenOrder.BAG_RANDOM || questionOrder === QuizScreenOrder.SEQUENTIAL) {
            // pop quesiton off
            const newBag = currentBag;
  
            // duplicate code
            setShowAnswer(false);
            setCurrentQuestion(newBag.pop());
            setQuestionBag(newBag);
          } else if (questionOrder === QuizScreenOrder.ALL_RANDOM) {
            // @todo pick a random item, do not pop off
          }
        } else {
          // console.log('reset bag');
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

        // console.log('currentDeck ' + JSON.stringify(currentDeck));
        // console.log('newbag ' + JSON.stringify(newBag));
        nextQuestion(newBag);
    };

    const hasQuestionData = !!currentQuestion.q;

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
                  <Pressable style={styles.toggleButton} onPress={() => setShowAnswer(!showAnswer)}>
                      <FlipCard
                          isFlipped={showAnswer}
                          frontText={currentQuestion.q}
                          backText={currentQuestion.a}
                        />
                  </Pressable>
                  <Button style={{marginTop: 10}} buttonColor="#0000ff" textColor="#e0e0e0" onPress={nextQuestion}>Next Card &gt;</Button>
                  <Text>num left {questionBag.length}</Text>
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
