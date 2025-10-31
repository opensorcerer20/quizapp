import { useRef } from "react";

import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

function ButtonAction({ onPress, btnStyles, color, label, labelColor, icon }) {
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
        {icon && <MaterialCommunityIcons name={icon} size={24} color={labelColor} />}
        {!icon && <Text style={{ color: labelColor, fontWeight: "700" }}>{label}</Text>}
      </Pressable>
    </View>
  );
}

export const makeButtonSettings = (onPress, label = null, bgColor, txtColor, icon = null) => ({
  onPress,
  label,
  icon,
  bgColor,
  txtColor,
});

const checkBtn = (btn) => {
  if (!btn.onPress || typeof btn.onPress !== "function" || (!btn.label && !btn.icon) || !btn.bgColor || !btn.txtColor) {
    throw new Error("button settings error");
  }
};

export default function SwipeableListItem({
  style = {},
  item,
  leftBtnSettings = null,
  rightBtnSettings = null,
  children,
}) {
  const swipeRef = useRef(null);
  if (leftBtnSettings) checkBtn(leftBtnSettings);
  if (rightBtnSettings) checkBtn(rightBtnSettings);

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
      containerStyle={style}
      ref={swipeRef}
      renderLeftActions={() =>
        !leftBtnSettings ? (
          <></>
        ) : (
          <ButtonAction
            label={leftBtnSettings.label}
            labelColor={leftBtnSettings.txtColor}
            color={leftBtnSettings.bgColor}
            onPress={() => handleBtnPress(leftBtnSettings.onPress)}
            btnStyles={[styles.actionsContainer, styles.actions, { alignItems: "flex-start" }]}
            icon={leftBtnSettings.icon}
          />
        )
      }
      renderRightActions={() =>
        !rightBtnSettings ? (
          <></>
        ) : (
          <ButtonAction
            label={rightBtnSettings.label}
            labelColor={rightBtnSettings.txtColor}
            color={rightBtnSettings.bgColor}
            onPress={() => handleBtnPress(rightBtnSettings.onPress)}
            btnStyles={[styles.actionsContainer, styles.actions, { alignItems: "flex-end" }]}
            icon={rightBtnSettings.icon}
          />
        )
      }
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
