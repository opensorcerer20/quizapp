import React, { useEffect, useState } from "react";

import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { formatCardText, getFontSize, getScheme } from "../../common/util";
import { useTheme } from "../Providers/ThemeProvider";

/**
 * based on https://docs.swmansion.com/react-native-reanimated/examples/flipCard/
 */

const CARDTYPE_QUESTION = "question";
const CARDTYPE_ANSWER = "answer";

const CardContent = ({ cardType, cardText, cardStyle, cardBg, textStyle, headerTextStyle }) => {
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
          borderColor: textStyle.color,
          backgroundColor: textStyle.color,
        },
      ]}
    >
      <Text
        style={[
          { fontWeight: "bold" },
          headerTextStyle,
          {
            textAlign: cardType === CARDTYPE_ANSWER ? "right" : "left",
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
  const scheme = getScheme(theme);
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
      cardStyle={[styles.card, scheme.border]}
      cardBg={isReversed ? scheme.cardA : scheme.cardQ}
      textStyle={scheme.txt}
      headerTextStyle={{ color: scheme.antiTxtBg.backgroundColor, fontSize: 20 }}
    />
  );

  const answerCard = (
    <CardContent
      cardType={isReversed ? CARDTYPE_QUESTION : CARDTYPE_ANSWER}
      cardText={flippedText}
      cardStyle={[styles.card, scheme.border]}
      cardBg={isReversed ? scheme.cardQ : scheme.cardA}
      textStyle={scheme.txt}
      headerTextStyle={{ color: scheme.antiTxtBg.backgroundColor, fontSize: 20 }}
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
    <View style={{ marginVertical: 10 }}>
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
    </View>
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
    marginVertical: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
      },
      android: {
        elevation: 5,
      },
    }),
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
