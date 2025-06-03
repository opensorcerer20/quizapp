import { Pressable, StyleSheet, View } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const NavButton = ({ enabled, onClick, children, extraStyles = {} }) => {
  return (
    <Pressable
      style={[styles.button, { backgroundColor: enabled ? "#ccccff" : "#999999" }, extraStyles]}
      onPress={enabled ? () => onClick() : () => {}}
      onLongPress={enabled ? () => onClick() : () => {}}
    >
      {children}
    </Pressable>
  );
};

export const DeckNav = ({ prevEnabled, onPrevClick, nextEnabled, onNextClick, onResetClick, onStartOverClick }) => {
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
        <NavButton enabled={true} onClick={onResetClick} buttonText="Remix" extraStyles={styles.buttonLeft}>
          <FontAwesome6 name="shuffle" size={24} color="black" />
        </NavButton>
        <NavButton enabled={prevEnabled} onClick={onPrevClick} buttonText="<">
          <FontAwesome6 name="chevron-left" size={24} color="black" />
        </NavButton>
        <NavButton enabled={nextEnabled} onClick={onNextClick} buttonText=">">
          <FontAwesome6 name="chevron-right" size={24} color="black" />
        </NavButton>
        <NavButton enabled={true} onClick={onStartOverClick} buttonText="Reload" extraStyles={styles.buttonRight}>
          <FontAwesome6 name="reply" size={24} color="black" />
        </NavButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: "20%",
    height: 40,
    margin: 0,
    borderColor: "#999999",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
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
