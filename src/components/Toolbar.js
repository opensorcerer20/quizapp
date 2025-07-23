import { useState } from "react";

import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { THEMES } from "../common/constants";
import { getScheme } from "../common/util";
import HelpMenuModal from "./HelpMenuModal";
import { useTheme } from "./Providers/ThemeProvider";
import { useLocale } from "./Providers/TranslationProvider";

const Toolbar = ({ title, showBack, helpType, hideButtons }) => {
  const { getLocalString } = useLocale();
  const [showHelp, setShowHelp] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const themeIcon = theme === THEMES.dark ? "moon-waning-crescent" : "weather-sunny";
  const scheme = getScheme(theme);

  const showHelpButton = !hideButtons && helpType !== null;
  return (
    <>
      <View style={[scheme.bgAccent3, styles.container]}>
        {showBack && (
          <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
            <Pressable onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={scheme.txt.color} />
            </Pressable>
          </View>
        )}
        <View style={{ flex: showBack ? 8 : 10, marginLeft: showBack ? 0 : 20 }}>
          <Text style={scheme.txt}>{title || getLocalString("Flashcard Library")}</Text>
        </View>
        <View style={{ width: 80, alignItems: "flex-end", marginRight: 10, flexDirection: "row" }}>
          <Pressable style={{ width: 40, alignItems: "flex-end" }} onPress={toggleTheme}>
            <MaterialCommunityIcons name={themeIcon} size={24} color={scheme.txt.color} />
          </Pressable>
          {showHelpButton && (
            <Pressable style={{ width: 40, alignItems: "flex-end" }} onPress={() => setShowHelp(!showHelp)}>
              <MaterialCommunityIcons name="help" size={24} color={scheme.txt.color} />
            </Pressable>
          )}
        </View>
      </View>

      <HelpMenuModal showModal={showHelp} setShowModal={setShowHelp} scheme={scheme} helpType={helpType} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

export default Toolbar;
