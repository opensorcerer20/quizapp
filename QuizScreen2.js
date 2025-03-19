//import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { schemes } from "./lib";
//import { FlipCard } from "./FlipCard";
//import { useSharedValue } from "react-native-reanimated";
import { Button } from "react-native-paper";
//import QuizSettings from "./QuizSettings";

const QuizScreen2 = ({
    colorScheme = "light",
    deckData,
    deckSettings,
}) => {

    //const showAnswer = useSharedValue(false);

    const hasDeckData = Array.isArray(deckData) && deckData.length > 0;

    return (
        <>
            {hasDeckData && (
                <View style={styles.container}>
                    <Text>num left</Text>
                </View>
            )}
            {!hasDeckData && (
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
