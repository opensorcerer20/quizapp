import { Pressable, StyleSheet, View } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { getScheme } from "../../common/util";
import { useTheme } from "../Providers/ThemeProvider";

const NavButton = ({ enabled, onClick, children, scheme, extraStyles = {} }) => {
  return (
    <Pressable
      style={[styles.button, enabled ? scheme.buttonBg : scheme.disabled, extraStyles]}
      onPress={enabled ? () => onClick() : () => {}}
      onLongPress={enabled ? () => onClick() : () => {}}
    >
      {children}
    </Pressable>
  );
};

export const DeckNav = ({ prevEnabled, onPrevClick, nextEnabled, onNextClick, onResetClick, onStartOverClick }) => {
  const { theme } = useTheme();

  const scheme = getScheme(theme);
  return (
    <View style={{ display: "flex", padding: 20, marginTop: 10 }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <NavButton
          enabled={true}
          scheme={scheme}
          onClick={onResetClick}
          buttonText="Remix"
          extraStyles={styles.buttonLeft}
        >
          <FontAwesome6 name="shuffle" size={24} color={scheme.buttonTxt.color} />
        </NavButton>
        <NavButton enabled={prevEnabled} scheme={scheme} onClick={onPrevClick} buttonText="<">
          <FontAwesome6 name="chevron-left" size={24} color={scheme.buttonTxt.color} />
        </NavButton>
        <NavButton enabled={nextEnabled} scheme={scheme} onClick={onNextClick} buttonText=">">
          <FontAwesome6 name="chevron-right" size={24} color={scheme.buttonTxt.color} />
        </NavButton>
        <NavButton
          enabled={true}
          scheme={scheme}
          onClick={onStartOverClick}
          buttonText="Reload"
          extraStyles={styles.buttonRight}
        >
          <FontAwesome6 name="reply" size={24} color={scheme.buttonTxt.color} />
        </NavButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: "20%",
    height: 50,
    margin: 0,
    borderColor: "#999999",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  buttonRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});
