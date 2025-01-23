import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {schemes} from "./lib";
import {FlipCard} from "./FlipCard";
import {useSharedValue} from "react-native-reanimated";

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
                    goToNext={nextQuestion}
                  />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 10,
    },
    card: {
      borderColor: "black",
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      width: "250px",
    },
    cardLight: {
        backgroundColor: "#ffffff",
    },
    cardDark: {
        backgroundColor: "#000000",
    },
    ...schemes
  });

export default FlashCard;
