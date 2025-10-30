import { useRef } from "react";

import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

function ButtonAction({ onPress, btnStyles, color, label, labelColor }) {
  const buttonStyle = {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: color,
    width: "auto",
    alignItems: "center",
    marginHorizontal: Platform.OS === "ios" ? 4 : 8,
  };
  return (
    <View style={btnStyles}>
      <Pressable onPress={onPress} style={buttonStyle} hitSlop={8}>
        <Text style={{ color: labelColor, fontWeight: "700" }}>{label}</Text>
      </Pressable>
    </View>
  );
}

export const makeButtonSettings = (onPress, label, bgColor, txtColor) => ({ onPress, label, bgColor, txtColor });

const checkBtn = (btn) => {
  if (!btn.onPress || typeof btn.onPress !== "function" || !btn.label || !btn.bgColor || !btn.txtColor) {
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
          labelColor={leftBtnSettings.txtColor}
          color={leftBtnSettings.bgColor}
          onPress={() => handleBtnPress(leftBtnSettings.onPress)}
          btnStyles={[styles.actionsContainer, styles.actions, { alignItems: "flex-start" }]}
        />
      )}
      renderRightActions={() => (
        <ButtonAction
          label={rightBtnSettings.label}
          labelColor={rightBtnSettings.txtColor}
          color={rightBtnSettings.bgColor}
          onPress={() => handleBtnPress(rightBtnSettings.onPress)}
          btnStyles={[styles.actionsContainer, styles.actions, { alignItems: "flex-end" }]}
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
