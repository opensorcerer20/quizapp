import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { schemes } from "./lib";
import { FlipCard } from "./FlipCard";
import { useSharedValue } from "react-native-reanimated";
import { Button } from "react-native-paper";
import QuizSettings from "./QuizSettings";

const QuizScreen = ({
    colorScheme = "light",
    currQ,
    nextQuestion,
    numLeft,
    deckSettings,
    updateDeckSettings
}) => {
    const showAnswer = useSharedValue(false);

    const flipCard = (reset = false) => {
        showAnswer.value = reset ? false : !showAnswer.value;
    };

    // @todo
    const scheme = colorScheme === "dark" ? styles.schemeDark : styles.schemeLight;
    // @todo
    const cardScheme = colorScheme === "dark" ? styles.cardDark : styles.cardLight;

    useEffect(() => {
        flipCard(true);
    }, [currQ]);

    // console.log('child order, pick, card: ' + JSON.stringify({order: pickOrder, mode: pickMode, card: cardMode}));
    // console.log('decksettings: ' + JSON.stringify(deckSettings));

    return (
        <View style={styles.container}>
            <QuizSettings deckSettings={deckSettings} updateDeckSettings={updateDeckSettings} />
            <Pressable style={styles.toggleButton} onPress={() => flipCard()}>
                <FlipCard
                    isFlipped={showAnswer}
                    frontText={currQ.q}
                    backText={currQ.a}
                  />
            </Pressable>
            <Button style={{marginTop: 10}} buttonColor="#0000ff" textColor="#e0e0e0" onPress={nextQuestion}>Next Card &gt;</Button>
            <Text>num left {numLeft}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    ...schemes
  });

export default QuizScreen;
