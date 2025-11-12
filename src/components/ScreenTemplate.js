import { router } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";

import { getInsetPadding, getScheme } from "../common/util";
import Background from "./Background";
import { useTheme } from "./Providers/ThemeProvider";
import Toolbar from "./Toolbar";

const ScreenTemplate = ({
  title = null,
  showBack = true,
  onBackClick = null,
  helpType = null,
  hideButtons = false,
  children,
}) => {
  if (onBackClick === null) {
    onBackClick = () => {
      router.replace({ pathname: "/", params: { RELOAD_LIST: true } });
    };
  }
  const { theme } = useTheme();
  const scheme = getScheme(theme);
  const insetStyle = getInsetPadding();

  return (
    <>
      <View style={[styles.container, insetStyle, scheme.bg, scheme.txt]}>
        <StatusBar barStyle={"default"} />
        <Background theme={theme}>
          <Toolbar
            title={title}
            showBack={showBack}
            helpType={helpType}
            hideButtons={hideButtons}
            onBackClick={onBackClick}
          />
          {children}
        </Background>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenTemplate;
