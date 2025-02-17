import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {schemes} from "./lib";
import {FlipCard} from "./FlipCard";
import {useSharedValue} from "react-native-reanimated";
import {Button} from "react-native-paper";

const FlashCard = ({colorScheme = "light", currQ, nextQuestion}) => {
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

    return (
        <View style={styles.container}>
            <Pressable style={styles.toggleButton} onPress={() => flipCard()}>
                <FlipCard
                    isFlipped={showAnswer}
                    frontText={currQ.q}
                    backText={currQ.a}
                  />
            </Pressable>
            <Button style={{marginTop: 10}} buttonColor="#0000ff" textColor="#e0e0e0" onPress={nextQuestion}>Next Card &gt;</Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    ...schemes
  });

export default FlashCard;
