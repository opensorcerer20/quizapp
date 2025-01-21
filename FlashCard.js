import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {schemes} from "./lib";
import { Button, Card, Text as CardText } from 'react-native-paper';

const FlashCard = ({colorScheme = "light", currQ, nextQuestion}) => {
    const [showAnswer, setShowAnswer] = useState(false);

    // @todo
    const scheme = colorScheme === "dark" ? styles.schemeDark : styles.schemeLight;
    // @todo
    const cardScheme = colorScheme === "dark" ? styles.cardDark : styles.cardLight;

    useEffect(() => {
        setShowAnswer(false);
    }, [currQ]);

    return (
        <View style={styles.container}>
            {showAnswer ? (
                <Card style={{backgroundColor: "#ffcccc"}} onPress={() => setShowAnswer(false)}>
                    <Card.Content>
                        <CardText variant="titleMedium">Back</CardText>
                        <CardText variant="bodyMedium">{currQ.a}</CardText>
                    </Card.Content>
                    <Card.Actions style={{height: 80}}>
                        <Button onPress={nextQuestion}>Next &gt;</Button>
                    </Card.Actions>
                </Card>
            ) : (
                <Card style={{backgroundColor: "#ccccff"}} onPress={() => setShowAnswer(true)}>
                    <Card.Content>
                        <CardText variant="titleMedium">Front</CardText>
                        <CardText variant="bodyMedium">{currQ.q}</CardText>
                    </Card.Content>
                    <Card.Actions style={{height: 80}}>
                        <Text>&nbsp;</Text>
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
