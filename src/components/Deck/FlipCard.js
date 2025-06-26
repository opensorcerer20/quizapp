import React, { useEffect, useState } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { THEMES } from "../../common/constants";
import { lightDarkStyles } from "../../common/lib";
import { formatCardText, getFontSize } from "../../common/util";
import { useTheme } from "../Providers/ThemeProvider";

/**
 * based on https://docs.swmansion.com/react-native-reanimated/examples/flipCard/
 */

const CARDTYPE_QUESTION = "question";
const CARDTYPE_ANSWER = "answer";

const CardContent = ({ cardType, cardText, cardStyle, textStyle }) => {
  const finalCardText = formatCardText(cardText);

  const fontSize = getFontSize(finalCardText.length);
  const textSizeStyle = fontSize !== "" ? styles[fontSize] : {};

  // console.log(
  //     "flipcard status " +
  //         JSON.stringify({ length: finalCardText.length, textSizeStyle })
  // );

  return (
    <View style={cardStyle}>
      <Text
        style={[
          { fontWeight: "bold" },
          textStyle,
          {
            textAlign: cardType === CARDTYPE_ANSWER ? "right" : "left",
          },
        ]}
      >
        {cardType === CARDTYPE_ANSWER ? "Answer" : "Question"}
      </Text>
      <Text style={[textStyle, textSizeStyle, { marginTop: 20 }]}>{finalCardText}</Text>
    </View>
  );
};

const TheCard = ({ isFlipped, cardStyle, direction = "y", duration = 500, regularText, flippedText, isReversed }) => {
  const { theme } = useTheme();
  const scheme = theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;
  const isDirectionX = direction === "x";

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue }],
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue }],
    };
  });

  const questionCard = (
    <CardContent
      cardType={isReversed ? CARDTYPE_ANSWER : CARDTYPE_QUESTION}
      cardText={regularText}
      cardStyle={[styles.card, isReversed ? scheme.bg4 : scheme.bg3]}
      textStyle={scheme.txt}
    />
  );

  const answerCard = (
    <CardContent
      cardType={isReversed ? CARDTYPE_QUESTION : CARDTYPE_ANSWER}
      cardText={flippedText}
      cardStyle={[styles.card, isReversed ? scheme.bg3 : scheme.bg4]}
      textStyle={scheme.txt}
    />
  );

  return (
    <View>
      <Animated.View style={[styles.regularCardContainer, cardStyle, regularCardAnimatedStyle]}>
        {isReversed ? answerCard : questionCard}
      </Animated.View>
      <Animated.View style={[styles.flippedCardContainer, cardStyle, flippedCardAnimatedStyle]}>
        {isReversed ? questionCard : answerCard}
      </Animated.View>
    </View>
  );
};

const FlipCard = ({ answerText, questionText, isReversed }) => {
  const [localQuestion, setLocalQuestion] = useState("");
  const [localAnswer, setLocalAnswer] = useState("");

  const isFlipped = useSharedValue(false);

  const handlePress = () => {
    isFlipped.value = !isFlipped.value;
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
  flipCard: {
    width: "100%",
    height: "auto",
    minHeight: 250,
    backfaceVisibility: "hidden",
    // margin: "auto", // <-- this works for flipped card, but not unflipped
  },
  cardTypeText: {
    color: "black",
    fontSize: 16,
    paddingRight: 10,
  },
  cardText: {
    color: "black",
    fontSize: 12,
  },
  l: {
    fontSize: 24,
  },
  xl: {
    fontSize: 32,
  },
  xxl: {
    fontSize: 40,
  },
  card: {
    flex: 1,
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
