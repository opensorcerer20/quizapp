import { StyleSheet, View } from "react-native";

import { getScheme } from "../common/util";

// via google.com ai
const Background = ({ theme, children }) => {
  const scheme = getScheme(theme);
  return (
    // <LinearGradient
    //   colors={[schemeBg.bgAccent2, schemeBg.bgAccent1, schemeBg.bgAccent2]} // Array of colors for the gradient
    //   style={styles.background}
    //   start={{ x: 0, y: 0 }} // Optional: start point of the gradient (top-left)
    //   end={{ x: 1, y: 1 }} // Optional: end point of the gradient (bottom-right)
    // >
    <View style={[styles.background, scheme.bg]}>{children}</View>
    // </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0, // Ensures it covers the entire parent View
  },
});

export default Background;
