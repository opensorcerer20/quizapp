import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {schemes} from "./lib";
import { Button, Card, Text as CardText } from 'react-native-paper';

const FlashCard = ({colorScheme = "light", currQ, nextQuestion}) => {
    const [showAnswer, setShowAnswer] = useState(false);

    const scheme = colorScheme === "dark" ? styles.schemeDark : styles.schemeLight;
    const cardScheme = colorScheme === "dark" ? styles.cardDark : styles.cardLight;

    useEffect(() => {
        setShowAnswer(false);
    }, [currQ]);

    return (
        <View style={styles.container}>

            {/*
            <View style={[styles.card, cardScheme]}>
                <View><Text style={scheme.txt}>{currQ.a}</Text></View>
                <MyButton onPress={nextQuestion} buttonText="Next Question"></MyButton>
            </View>
            
            <View style={[styles.card, cardScheme]}>
                <View><Text style={scheme.txt}>{currQ.q}</Text></View>
                <MyButton onPress={() => setShowAnswer(true)} buttonText="Show Answer"></MyButton>
            </View>
            */}
            {showAnswer ? (
                <Card>
                    <Card.Content>
                        <CardText variant="titleMedium">Front/Back</CardText>
                        <CardText variant="bodyMedium">{currQ.a}</CardText>
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={nextQuestion}>Next Question</Button>
                    </Card.Actions>
                </Card>
            ) : (
                <Card>
                    <Card.Content>
                        <CardText variant="titleMedium">Front/Back</CardText>
                        <CardText variant="bodyMedium">{currQ.q}</CardText>
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={() => setShowAnswer(true)}>Show Answer</Button>
                    </Card.Actions>
                </Card>
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
