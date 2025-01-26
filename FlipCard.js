import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

// based on React Native Reanimated FlipCard example: https://docs.swmansion.com/react-native-reanimated/examples/flipCard
export const FlipCard = ({
  isFlipped,
  direction='y',
  duration=300,
  frontText="Front Text",
  backText="Back Text",
}) => {
  const isDirectionX = direction === 'x';

  const regularCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });

  const flippedCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration });

    return {
      transform: [
        isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
      ],
    };
  });

  return (
    <View>
      <Animated.View
        style={[
          flipCardStyles.regularCard,
          styles.flipCard,
          regularCardAnimatedStyle,
        ]}>
        <View style={styles.frontCard}>
          <Text style={styles.frontText}>{frontText}</Text>
        </View>
      </Animated.View>
      <Animated.View
        style={[
          flipCardStyles.flippedCard,
          styles.flipCard,
          flippedCardAnimatedStyle,
        ]}>
        <View style={styles.backCard}>
          <Text style={styles.backText}>{backText}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const flipCardStyles = StyleSheet.create({
  regularCard: {
    position: 'absolute',
    zIndex: 1,
  },
  flippedCard: {
    zIndex: 2,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipCard: {
    width: 300,
    height: 200,
    backfaceVisibility: 'hidden',
  },
  frontCard: {
    flex: 1,
    backgroundColor: '#b6cff7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frontText: {
    color: '#001a72',
  },
  backCard: {
    flex: 1,
    backgroundColor: '#baeee5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    color: '#001a72',
  },
});
