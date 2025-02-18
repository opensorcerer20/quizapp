import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {schemes} from "./lib";
import {FlipCard} from "./FlipCard";
import {useSharedValue} from "react-native-reanimated";
import {Button, SegmentedButtons} from "react-native-paper";

const FlashCard = ({
    colorScheme = "light", 
    currQ, 
    nextQuestion, 
    numLeft, 
    deckSettings, 
    updateDeckSettings
}) => {
    const [pickOrder, setPickOrder] = useState(deckSettings.pickOrder);
    const [pickMode, setPickMode] = useState(deckSettings.pickMode);
    const [cardMode, setCardMode] = useState(deckSettings.cardMode);
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

    useEffect(() => {
        updateDeckSettings(pickOrder, pickMode, cardMode);
    }, [pickOrder, pickMode, cardMode]);

    // console.log('child order, pick, card: ' + JSON.stringify({order: pickOrder, mode: pickMode, card: cardMode}));

    return (
        <View style={styles.container}>
            <SegmentedButtons
                style={{ padding: 5 }}
                value={pickOrder}
                onValueChange={setPickOrder}
                buttons={[
                  {
                    value: 'random',
                    label: 'Random',
                  },
                  {
                    value: 'sequential',
                    label: 'Sequential',
                  },
                ]}
            />
            <SegmentedButtons
                style={{ padding: 5 }}
                value={pickMode}
                onValueChange={setPickMode}
                buttons={[
                  {
                    value: 'bag',
                    label: 'Grab Bag',
                  },
                  {
                    value: 'continuous',
                    label: 'Continuous',
                  },
                ]}
            />
            <SegmentedButtons
                style={{ padding: 5 }}
                value={cardMode}
                onValueChange={setCardMode}
                buttons={[
                  {
                    value: 'repeat',
                    label: 'Repeat',
                  },
                  { 
                    value: 'once', 
                    label: 'Once Only' 
                  },
                ]}
            />
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

export default FlashCard;
