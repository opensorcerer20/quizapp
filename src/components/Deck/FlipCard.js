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

const CardContent = ({ cardType, cardText, cardStyle, cardBg, textStyle }) => {
  const finalCardText = formatCardText(cardText);

  const fontSize = getFontSize(finalCardText.length);
  const textSizeStyle = fontSize !== "" ? styles[fontSize] : {};

  const CardHeader = () => (
    <View
      style={[
        cardType === CARDTYPE_ANSWER ? { marginLeft: "auto", marginRight: 0 } : { marginLeft: 0, marginRight: "auto" },
        {
          borderWidth: 1,
          borderRadius: 5,
          padding: 2,
          backgroundColor: textStyle.color,
        },
      ]}
    >
      <Text
        style={[
          { fontWeight: "bold" },
          textStyle,
          {
            textAlign: cardType === CARDTYPE_ANSWER ? "right" : "left",
            color: cardBg.backgroundColor,
          },
        ]}
      >
        {cardType === CARDTYPE_ANSWER ? "Answer" : "Question"}
      </Text>
    </View>
  );

  // console.log(
  //     "flipcard status " +
  //         JSON.stringify({ length: finalCardText.length, textSizeStyle })
  // );
  return (
    <View style={[cardStyle, { backgroundColor: cardBg.backgroundColor }]}>
      <CardHeader />
      <Text style={[textStyle, textSizeStyle, { marginTop: 10 }]}>{finalCardText}</Text>
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
      cardStyle={styles.card}
      cardBg={isReversed ? scheme.bgAccent2 : scheme.bgAccent1}
      textStyle={scheme.txt}
    />
  );

  const answerCard = (
    <CardContent
      cardType={isReversed ? CARDTYPE_QUESTION : CARDTYPE_ANSWER}
      cardText={flippedText}
      cardStyle={styles.card}
      cardBg={isReversed ? scheme.bgAccent1 : scheme.bgAccent2}
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
