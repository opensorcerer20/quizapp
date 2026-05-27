import React, { useEffect, useState } from "react";

import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { SAFE_WIDTH, THEMES } from "../../common/constants";
import { globalStyles } from "../../common/lib";
import { formatCardText, getFontSize, getScheme } from "../../common/util";
import { useTheme } from "../Providers/ThemeProvider";
import { useLocale } from "../Providers/TranslationProvider";
import { ANSWER_FIRST } from "../Quiz/ReviewScreen";
import TextNormal from "../TextNormal";

/**
 * based on https://docs.swmansion.com/react-native-reanimated/examples/flipCard/
 */

const CARDTYPE_QUESTION = "question";
const CARDTYPE_ANSWER = "answer";

const CardContent = ({ cardType, cardText, cardStyle, cardBg, textStyle, headerTextStyle }) => {
  //console.log("headerTextStyle " + JSON.stringify(headerTextStyle));
  const { getLocalString } = useLocale();
  const finalCardText = formatCardText(cardText);

  const fontSize = getFontSize(finalCardText.length);
  const textSizeStyle = fontSize !== "" ? { ...styles[fontSize] } : {};
  const qStyle = { marginLeft: 0, marginRight: "auto" };
  const aStyle = { marginLeft: "auto", marginRight: 0 };

  const CardHeader = () => (
    <View
      style={[
        cardType === CARDTYPE_ANSWER ? aStyle : qStyle,
        styles.cardHeaderContainer,
        {
          borderColor: textStyle.color,
          backgroundColor: textStyle.color,
          marginBottom: 4,
        },
      ]}
    >
      <TextNormal
        style={[
          { fontWeight: "bold" },
          headerTextStyle,
          {
            textAlign: cardType === CARDTYPE_ANSWER ? "right" : "left",
          },
        ]}
      >
        {cardType === CARDTYPE_ANSWER ? getLocalString("Answer") : getLocalString("Question")}
      </TextNormal>
    </View>
  );

  // const arrowElement = <TextNormal style={{ marginTop: "auto", marginBottom: "auto" }}>Y</TextNormal>;
  const makeArrow = (direction = "right") => {
    direction = direction === "left" ? "left" : "right";
    return (
      <View
        style={{
          marginVertical: "auto",
          borderWidth: 1,
          borderColor: textStyle.color,
          borderRadius: 10,
          marginHorizontal: 5,
        }}
      >
        <MaterialCommunityIcons name={"chevron-double-" + direction} size={24} color={textStyle.color} />
      </View>
    );
  };

  // console.log(
  //     "flipcard status " +
  //         JSON.stringify({ length: finalCardText.length, textSizeStyle })
  // );

  /*
  - add simple "off/on" switch to card in bottom right corner
  - if off, card is greyed out
  */

  // only show arrow for question part; yes they can still click to go back, but the point was to have them click in the first place
  return (
    <>
      {cardType === CARDTYPE_QUESTION && (
        <View
          style={[
            cardStyle,
            cardBg,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: "#000000",
              height: 200,
            },
          ]}
        >
          <View style={{ flexDirection: "column" }}>
            <CardHeader />
            <TextNormal
              numberOfLines={6}
              ellipsizeMode="tail"
              style={[textStyle, textSizeStyle, { width: SAFE_WIDTH * 0.8 }]}
            >
              {finalCardText}
            </TextNormal>
          </View>
          {makeArrow("right")}
        </View>
      )}
      {cardType === CARDTYPE_ANSWER && (
        <View style={[cardStyle, cardBg, { borderWidth: 1, borderColor: "#000000" }]}>
          <View style={{ flexDirection: "column" }}>
            <CardHeader />
            <TextNormal
              numberOfLines={6}
              ellipsizeMode="tail"
              style={[textStyle, textSizeStyle, { width: SAFE_WIDTH * 0.8 }]}
            >
              {finalCardText}
            </TextNormal>
          </View>
        </View>
      )}
    </>
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

  const headerTextStyle = {
    color: theme === THEMES.dark ? globalStyles.txtBlack.color : globalStyles.txtWhite.color,
    fontSize: 20,
  };

  const questionCard = (
    <CardContent
      cardType={isReversed ? CARDTYPE_ANSWER : CARDTYPE_QUESTION}
      cardText={regularText}
      cardStyle={[styles.card, scheme.border]}
      cardBg={isReversed ? scheme.bgSecondary : scheme.bgPrimary}
      textStyle={scheme.txt}
      headerTextStyle={headerTextStyle}
    />
  );

  const answerCard = (
    <CardContent
      cardType={isReversed ? CARDTYPE_QUESTION : CARDTYPE_ANSWER}
      cardText={flippedText}
      cardStyle={[styles.card, scheme.border]}
      cardBg={isReversed ? scheme.bgPrimary : scheme.bgSecondary}
      textStyle={scheme.txt}
      headerTextStyle={headerTextStyle}
    />
  );

  return (
    <View style={styles.viewShadow}>
      <Animated.View style={[styles.regularCardContainer, cardStyle, regularCardAnimatedStyle]}>
        {isReversed ? answerCard : questionCard}
      </Animated.View>
      <Animated.View style={[styles.flippedCardContainer, cardStyle, flippedCardAnimatedStyle]}>
        {isReversed ? questionCard : answerCard}
      </Animated.View>
    </View>
  );
};

const FlipCard = ({ answerText, questionText, showFirst }) => {
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

  const isReversed = showFirst === ANSWER_FIRST;

  return (
    <View style={{ marginVertical: 10, marginHorizontal: "auto" }}>
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
    maxWidth: SAFE_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  flipCard: {
    width: SAFE_WIDTH,
    height: "auto",
    minHeight: 250,
    backfaceVisibility: "hidden",
  },
  l: {
    fontSize: Platform.OS === "ios" ? 24 : 20,
  },
  xl: {
    fontSize: Platform.OS === "ios" ? 32 : 28,
  },
  xxl: {
    fontSize: Platform.OS === "ios" ? 40 : 32,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 10,
    marginVertical: 5,
  },
  viewShadow: {
    ...Platform.select({
      ios: {
        shadowColor: globalStyles.bgBlack.backgroundColor,
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
  cardHeaderContainer: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
});

export default FlipCard;
