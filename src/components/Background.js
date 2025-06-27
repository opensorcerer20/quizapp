import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

import { THEMES } from "../common/constants";
import { lightDarkStyles } from "../common/lib";

// via google.com ai
const Background = ({ theme, children }) => {
  const scheme = theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;
  return (
    <LinearGradient
      colors={[scheme.bgAccent2.backgroundColor, scheme.bgAccent1.backgroundColor, scheme.bgAccent2.backgroundColor]} // Array of colors for the gradient
      style={styles.background}
      start={{ x: 0, y: 0 }} // Optional: start point of the gradient (top-left)
      end={{ x: 1, y: 1 }} // Optional: end point of the gradient (bottom-right)
    >
      {children}
    </LinearGradient>
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
  ...lightDarkStyles,
});

export default Background;
