import { useRef } from "react";

import { Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

function ButtonAction({ onPress, btnStyles, color, label }) {
  const buttonStyle = {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: color,
  };
  return (
    <View style={btnStyles}>
      <Pressable onPress={onPress} style={buttonStyle} hitSlop={8}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>{label}</Text>
      </Pressable>
    </View>
  );
}

export const makeButtonSettings = (onPress, label, color) => ({ onPress, label, color });

const checkBtn = (btn) => {
  if (!btn.onPress || typeof btn.onPress !== "function" || !btn.label || !btn.color) {
    throw new Error("button wrong format");
  }
};

export default function SwipeableListItem({ item, leftBtnSettings, rightBtnSettings, children }) {
  const swipeRef = useRef(null);
  checkBtn(leftBtnSettings);
  checkBtn(rightBtnSettings);

  const close = () => {
    if (swipeRef.current && typeof swipeRef.current.close === "function") {
      swipeRef.current.close();
    }
  };

  const handleBtnPress = (onPress) => {
    close();
    if (onPress) onPress(item);
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderLeftActions={() => (
        <ButtonAction
          label={leftBtnSettings.label}
          color={leftBtnSettings.color}
          onPress={() => handleBtnPress(leftBtnSettings.onPress)}
          btnStyles={[styles.actionsContainer, styles.actions, { width: 96, alignItems: "flex-start", paddingLeft: 8 }]}
        />
      )}
      renderRightActions={() => (
        <ButtonAction
          label={rightBtnSettings.label}
          color={rightBtnSettings.color}
          onPress={() => handleBtnPress(rightBtnSettings.onPress)}
          btnStyles={[styles.actionsContainer, styles.actions, { width: 96, alignItems: "flex-end", paddingRight: 8 }]}
        />
      )}
      overshootLeft={false}
      overshootRight={false}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    justifyContent: "center",
  },
});
