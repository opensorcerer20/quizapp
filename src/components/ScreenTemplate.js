import { StyleSheet, View } from "react-native";

import { THEMES } from "../common/constants";
import { lightDarkStyles } from "../common/lib";
import { useTheme } from "../components/Providers/ThemeProvider";

const ScreenTemplate = ({ children }) => {
  const { theme } = useTheme();
  const scheme = theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;

  return <View style={[styles.container, scheme.bg, scheme.txt]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ...lightDarkStyles,
});

export default ScreenTemplate;
