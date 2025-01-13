import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {MyButton, schemes} from "./lib";

const FlashCard = ({colorScheme = "light", currQ, nextQuestion}) => {
    const [showAnswer, setShowAnswer] = useState(false);

    const scheme = colorScheme === "dark" ? styles.schemeDark : styles.schemeLight;
    const cardScheme = colorScheme === "dark" ? styles.cardDark : styles.cardLight;

    useEffect(() => {
        setShowAnswer(false);
    }, [currQ]);

    return (
        <View style={styles.container}>
            {showAnswer ? (
                <View style={[styles.card, cardScheme]}>
                    <View><Text style={scheme.txt}>{currQ.a}</Text></View>
                    <MyButton onPress={nextQuestion} buttonText="Next Question"></MyButton>
                </View>
            ) : (
                <View style={[styles.card, cardScheme]}>
                    <View><Text style={scheme.txt}>{currQ.q}</Text></View>
                    <MyButton onPress={() => setShowAnswer(true)} buttonText="Show Answer"></MyButton>
                </View>
            )}
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
