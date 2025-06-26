import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

// via google.com ai
const Background = ({ theme, children }) => {
  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]} // Array of colors for the gradient
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
});

export default Background;
