import { Pressable, StyleSheet, View } from "react-native";

import { THEMES } from "../common/constants";
import { getScheme } from "../common/util";
import { StyledSwitch } from "./Deck/StyledSwitch";
import { useTheme } from "./Providers/ThemeProvider";

export const APP_MENU_WIDTH = 250;

const AppMenu = () => {
  const { theme, toggleTheme } = useTheme();
  const scheme = getScheme(theme);
  return (
    <View style={{ width: APP_MENU_WIDTH }}>
      <Pressable onPress={() => {}}>
        <View style={styles.menuItem}>
          <StyledSwitch
            theme={theme}
            txtStyle={[scheme.txt, { fontWeight: "bold" }]}
            optionValue={theme === THEMES.dark}
            onClick={toggleTheme}
            labelTxt={"Dark Theme"}
          />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 30,
  },
  menuText: {
    paddingLeft: 5,
  },
});

export default AppMenu;
