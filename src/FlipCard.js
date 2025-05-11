import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { delay, formatCardText } from "./util";

/**
 * based on https://docs.swmansion.com/react-native-reanimated/examples/flipCard/
 */

const CardContent = ({ cardText, cardStyle, textStyle }) => {
    return (
        <View style={cardStyle}>
            <Text style={textStyle}>{formatCardText(cardText)}</Text>
        </View>
    );
};

const TheCard = ({
    isFlipped,
    cardStyle,
    direction = "y",
    duration = 500,
    regularText,
    flippedText,
}) => {
    const isDirectionX = direction === "x";

    const regularCardAnimatedStyle = useAnimatedStyle(() => {
        const spinValue = interpolate(
            Number(isFlipped.value),
            [0, 1],
            [0, 180]
        );
        const rotateValue = withTiming(`${spinValue}deg`, { duration });

        return {
            transform: [
                isDirectionX
                    ? { rotateX: rotateValue }
                    : { rotateY: rotateValue },
            ],
        };
    });

    const flippedCardAnimatedStyle = useAnimatedStyle(() => {
        const spinValue = interpolate(
            Number(isFlipped.value),
            [0, 1],
            [180, 360]
        );
        const rotateValue = withTiming(`${spinValue}deg`, { duration });

        return {
            transform: [
                isDirectionX
                    ? { rotateX: rotateValue }
                    : { rotateY: rotateValue },
            ],
        };
    });

    return (
        <View>
            <Animated.View
                style={[
                    styles.regularCardContainer,
                    cardStyle,
                    regularCardAnimatedStyle,
                ]}
            >
                <CardContent
                    cardText={regularText}
                    cardStyle={styles.regularCard}
                    textStyle={styles.regularText}
                />
            </Animated.View>
            <Animated.View
                style={[
                    styles.flippedCardContainer,
                    cardStyle,
                    flippedCardAnimatedStyle,
                ]}
            >
                <CardContent
                    cardText={flippedText}
                    cardStyle={styles.flippedCard}
                    textStyle={styles.flippedText}
                />
            </Animated.View>
        </View>
    );
};

const FlipCard = ({ answerText, questionText, nextQuestion }) => {
    const [localQuestion, setLocalQuestion] = useState("");
    const [localAnswer, setLocalAnswer] = useState("");

    const isFlipped = useSharedValue(false);

    const handlePress = () => {
        isFlipped.value = !isFlipped.value;
    };

    const clickNext = async () => {
        nextQuestion();
    };

    useEffect(() => {
        setLocalAnswer(answerText);
    }, [answerText]);

    useEffect(() => {
        setLocalQuestion(questionText);
    }, [questionText]);

    return (
        <>
            <Pressable onPress={handlePress}>
                <TheCard
                    isFlipped={isFlipped}
                    cardStyle={styles.flipCard}
                    flippedText={localAnswer}
                    regularText={localQuestion}
                />
            </Pressable>
            <Button
                style={{ marginTop: 10 }}
                buttonColor="#0000ff"
                textColor="#e0e0e0"
                onPress={() => clickNext()}
            >
                Next Card &gt;
            </Button>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 300,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonContainer: {
        marginTop: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    toggleButton: {
        backgroundColor: "#b58df1",
        padding: 12,
        borderRadius: 48,
    },
    toggleButtonText: {
        color: "#fff",
        textAlign: "center",
    },
    flipCard: {
        width: "100%",
        height: 250,
        backfaceVisibility: "hidden",
        // margin: "auto", // <-- this works for flipped card, but not unflipped
    },
    regularCard: {
        flex: 1,
        backgroundColor: "#00cff7",
        borderRadius: 16,
        padding: 10,
    },
    regularText: {
        color: "#001a72",
    },
    flippedCard: {
        flex: 1,
        backgroundColor: "#77ee00",
        borderRadius: 16,
        padding: 10,
    },
    flippedText: {
        color: "#001a72",
    },
    regularCardContainer: {
        position: "absolute",
        zIndex: 1,
    },
    flippedCardContainer: {
        zIndex: 2,
    },
});

export default FlipCard;
