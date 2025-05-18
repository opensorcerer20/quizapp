import React, { useEffect, useState } from "react";
import { Pressable, View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { formatCardText } from "./util";
import { useTheme } from "./ThemeProvider";
import { lightDarkStyles } from "./lib";
import { MAX_CHAR_LIMIT_L, MAX_CHAR_LIMIT_XL, THEMES } from "./constants";

/**
 * based on https://docs.swmansion.com/react-native-reanimated/examples/flipCard/
 */

const CARDTYPE_QUESTION = "question";
const CARDTYPE_ANSWER = "answer";

const CardContent = ({ cardType, cardText, cardStyle, textStyle }) => {
    const finalCardText = formatCardText(cardText);

    let textSizeStyle = {};
    if (finalCardText.length <= MAX_CHAR_LIMIT_XL) {
        textSizeStyle = styles.xl;
    } else if (finalCardText.length <= MAX_CHAR_LIMIT_L) {
        textSizeStyle = styles.l;
    }

    // console.log(
    //     "flipcard status " +
    //         JSON.stringify({ length: finalCardText.length, textSizeStyle })
    // );

    return (
        <View style={cardStyle}>
            <Text style={[{ fontWeight: "bold" }, styles.cardTypeText]}>
                {cardType === CARDTYPE_ANSWER ? "Answer:" : "Question:"}
            </Text>
            <Text style={[textStyle, textSizeStyle, { marginTop: 20 }]}>
                {finalCardText}
            </Text>
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
    isReversed,
}) => {
    const { theme } = useTheme();
    const scheme =
        theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;
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

    const questionCard = (
        <CardContent
            cardType={isReversed ? CARDTYPE_ANSWER : CARDTYPE_QUESTION}
            cardText={regularText}
            cardStyle={isReversed ? styles.flippedCard : styles.regularCard}
            textStyle={styles.cardText}
        />
    );

    const answerCard = (
        <CardContent
            cardType={isReversed ? CARDTYPE_QUESTION : CARDTYPE_ANSWER}
            cardText={flippedText}
            cardStyle={isReversed ? styles.regularCard : styles.flippedCard}
            textStyle={styles.cardText}
        />
    );

    return (
        <View>
            <Animated.View
                style={[
                    styles.regularCardContainer,
                    cardStyle,
                    regularCardAnimatedStyle,
                ]}
            >
                {isReversed ? answerCard : questionCard}
            </Animated.View>
            <Animated.View
                style={[
                    styles.flippedCardContainer,
                    cardStyle,
                    flippedCardAnimatedStyle,
                ]}
            >
                {isReversed ? questionCard : answerCard}
            </Animated.View>
        </View>
    );
};

const FlipCard = ({
    answerText,
    questionText,
    nextQuestion,
    buttonText,
    isReversed,
}) => {
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
                    duration={250}
                    cardStyle={styles.flipCard}
                    flippedText={localAnswer}
                    regularText={localQuestion}
                    isReversed={isReversed}
                />
            </Pressable>
            <Button
                style={{ marginTop: 10 }}
                buttonColor="#0000ff"
                textColor="#e0e0e0"
                onPress={() => clickNext()}
            >
                {buttonText}
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
        height: "auto",
        minHeight: 250,
        backfaceVisibility: "hidden",
        // margin: "auto", // <-- this works for flipped card, but not unflipped
    },
    regularCard: {
        flex: 1,
        backgroundColor: "#00cff7",
        borderRadius: 16,
        padding: 10,
    },
    cardTypeText: {
        color: "#001a72",
        fontSize: 16,
    },
    cardText: {
        color: "#001a72",
        fontSize: 16,
    },
    l: {
        fontSize: 24,
    },
    xl: {
        fontSize: 32,
    },
    flippedCard: {
        flex: 1,
        backgroundColor: "#77ee00",
        borderRadius: 16,
        padding: 10,
    },
    regularCardContainer: {
        position: "absolute",
        zIndex: 1,
    },
    flippedCardContainer: {
        zIndex: 2,
    },
    ...lightDarkStyles,
});

export default FlipCard;
