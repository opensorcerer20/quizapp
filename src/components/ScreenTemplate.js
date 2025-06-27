import { StyleSheet, View } from "react-native";

import { getScheme } from "../common/util";
import { useTheme } from "../components/Providers/ThemeProvider";
import Background from "./Background";

const ScreenTemplate = ({ children }) => {
  const { theme } = useTheme();
  const scheme = getScheme(theme);

  return (
    <View style={[styles.container, scheme.bgPrimary, scheme.txt]}>
      <Background theme={theme}>{children}</Background>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenTemplate;
