import { useState } from "react";

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { THEMES } from "../common/constants";
import { getScheme } from "../common/util";
import { useTheme } from "../components/Providers/ThemeProvider";
import Background from "./Background";
import HelpMenu from "./HelpMenu";
import { useLocale } from "./Providers/TranslationProvider";

const ScreenTemplate = ({ title = null, showBack = true, children }) => {
  const { getLocalString } = useLocale();
  const [showHelp, setShowHelp] = useState(false);

  const { theme, toggleTheme } = useTheme();
  let themeIcon = theme === THEMES.dark ? "moon-waning-crescent" : "weather-sunny";
  const scheme = getScheme(theme);

  // @todo remove borders

  return (
    <>
      <View style={[styles.container, scheme.bgPrimary, scheme.txt]}>
        <StatusBar style={Platform.OS === "android" ? "inverted" : "auto"} />
        <Background theme={theme}>
          <View
            style={[
              scheme.baseBg,
              {
                borderColor: "red",
                borderWidth: 0,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              },
            ]}
          >
            <View
              style={{ borderColor: "red", borderWidth: 0, flex: 2, alignItems: "center", justifyContent: "center" }}
            >
              <Pressable onPress={() => router.back()}>
                {showBack && <MaterialIcons name="arrow-back" size={24} color={scheme.txt.color} />}
              </Pressable>
            </View>
            <View style={{ borderColor: "red", borderWidth: 0, flex: 8 }}>
              <View style={{ borderColor: "red", borderWidth: 0, flexDirection: "row" }}>
                <View style={{ borderColor: "red", borderWidth: 0, flex: 8, justifyContent: "center" }}>
                  <Text style={[scheme.txt, { fontSize: 16 }]}>{title || getLocalString("Flashcard Library")}</Text>
                </View>
                <View
                  style={{
                    borderColor: "red",
                    borderWidth: 0,
                    flex: 4,
                    justifyContent: "center",
                    alignItems: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ borderColor: "red", borderWidth: 0, flex: 6, alignItems: "flex-end" }}>
                    <Pressable style={{}} onPress={toggleTheme}>
                      <MaterialCommunityIcons name={themeIcon} size={24} color={scheme.txt.color} />
                    </Pressable>
                  </View>
                  <View style={{ borderColor: "red", borderWidth: 0, flex: 6, alignItems: "flex-end" }}>
                    <Pressable onPress={() => setShowHelp(!showHelp)}>
                      <MaterialCommunityIcons name="help" size={24} color={scheme.txt.color} />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{ borderColor: "red", borderWidth: 0, flex: 2, alignItems: "center", justifyContent: "center" }}
            >
              {/* 
              - menu with tips, similar to deck menu
              <Pressable onPress={() => setShowHelp(!showHelp)}>
               */}
              <MaterialCommunityIcons name="dots-vertical" size={24} color={scheme.txt.color} />
              {/* </Pressable> */}
            </View>
          </View>
          {showHelp && <HelpMenu helpType={showBack ? "deck" : "list"} showHelp={showHelp} setShowHelp={setShowHelp} />}
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
