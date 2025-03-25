//import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { schemes } from "./lib";
//import { FlipCard } from "./FlipCard";
//import { useSharedValue } from "react-native-reanimated";
import { Button } from "react-native-paper";
import {cleanDeckSettings} from "./QuizDeck";
import {makeQuestionObject} from "./util";
//import QuizSettings from "./QuizSettings";

const QuizScreen2 = ({
    colorScheme = "light",
    currentDeck,
    deckSettings = cleanDeckSettings(null, null, null),
    updateDeckSettings = () => {}
}) => {
    //const showAnswer = useSharedValue(false);
    const [questionBag, setQuestionBag] = useState([]);
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

*** what does deckData actually represent?
- deckData is actually "deck list data"

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

v back button clicked
- response
  - calls method in parent to unset currentDeck
  - when currentDeck is empty, deck list shows


NEW THING
- when currentDeck changes, empty question bag
- if question bag empty, fill

*/
    const nextQuestion = () => {
        if (questionBag.length) {
            const newBag = questionBag;
            setCurrentQuestion(newBag.pop());
            setQuestionBag(newBag);
        } else {
            resetQuestionBag();
        }
    }

    const resetQuestionBag = () => {
        // fill bag with questions randomized according to settings
        const newBag = [];
        currentDeck.map(questionData => newBag.push(makeQuestionObject(questionData.q, questionData.a)));
        setQuestionBag(newBag);
    };

    useEffect(() => {
        resetQuestionBag();
    }, [currentDeck])

    const hasQuestionData = Array.isArray(currentDeck) && currentDeck.length > 0;

    return (
        <>
            {hasQuestionData && (
                <View style={styles.container}>
                    <Text>num left</Text>
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

export default QuizScreen2;
