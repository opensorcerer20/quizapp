import { useState } from "react";

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { THEMES } from "../common/constants";
import { getScheme } from "../common/util";
import { useTheme } from "../components/Providers/ThemeProvider";
import AppMenu from "./AppMenu";
import Background from "./Background";
import HelpMenu from "./HelpMenu";
import { useLocale } from "./Providers/TranslationProvider";
import QuizModal from "./QuizModal";

const ScreenTemplate = ({ title = null, showBack = true, helpType = null, hideButtons = false, children }) => {
  const { width } = Dimensions.get("window");
  const SAFE_MARGIN = Math.round(width / 20); // 5% width
  const SAFE_WIDTH = width - Math.round(width / 20); // 95% width
  const helpModalWidth = Math.min(SAFE_WIDTH, 300);

  const { getLocalString } = useLocale();
  const [showHelp, setShowHelp] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { theme, toggleTheme } = useTheme();
  let themeIcon = theme === THEMES.dark ? "moon-waning-crescent" : "weather-sunny";
  const scheme = getScheme(theme);

  console.log("showmenu " + JSON.stringify(showMenu));

  return (
    <>
      <View style={[styles.container, scheme.bgPrimary, scheme.txt]}>
        <StatusBar style={Platform.OS === "android" ? "inverted" : "auto"} />
        <Background theme={theme}>
          <View
            style={[
              scheme.baseBg,
              {
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              },
            ]}
          >
            <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
              {showBack && (
                <Pressable onPress={() => router.back()}>
                  <MaterialIcons name="arrow-back" size={24} color={scheme.txt.color} />
                </Pressable>
              )}
            </View>

            <View style={{ flex: 8 }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 8, justifyContent: "center" }}>
                  <Text style={[scheme.txt, { fontSize: 16 }]}>{title || getLocalString("Flashcard Library")}</Text>
                </View>
                <View
                  style={{
                    borderWidth: 0,
                    flex: 4,
                    justifyContent: "center",
                    alignItems: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  {!hideButtons && (
                    <>
                      <View style={{ flex: 6, alignItems: "flex-end" }}>
                        <Pressable style={{}} onPress={toggleTheme}>
                          <MaterialCommunityIcons name={themeIcon} size={24} color={scheme.txt.color} />
                        </Pressable>
                      </View>
                      {helpType !== null && (
                        <View style={{ flex: 6, alignItems: "flex-end" }}>
                          <Pressable onPress={() => setShowHelp(!showHelp)}>
                            <MaterialCommunityIcons name="help" size={24} color={scheme.txt.color} />
                          </Pressable>
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>
            </View>
            <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
              {!hideButtons && (
                <Pressable onPress={() => setShowMenu(!showMenu)}>
                  <MaterialCommunityIcons name="dots-vertical" size={24} color={scheme.txt.color} />
                </Pressable>
              )}
            </View>
          </View>
          <QuizModal
            modalVisible={showMenu}
            handleModalClickAway={() => setShowMenu(false)}
            modalContainerStyle={[
              styles.menuModal,
              {
                top: 50,
                left: SAFE_WIDTH - 150,
                width: 150,
              },
              scheme.baseBg,
              { borderColor: scheme.bgAccent2.backgroundColor, borderWidth: 1 },
            ]}
          >
            <AppMenu scheme={scheme} />
          </QuizModal>

          <QuizModal
            modalVisible={showHelp}
            handleModalClickAway={() => setShowHelp(false)}
            modalContainerStyle={[
              styles.helpModal,
              {
                top: 100,
                left: SAFE_WIDTH / 2 - helpModalWidth / 2 + SAFE_MARGIN / 2,
                width: helpModalWidth,
              },
              scheme.baseBg,
              { borderColor: scheme.bgAccent2.backgroundColor, borderWidth: 1 },
            ]}
          >
            <HelpMenu scheme={scheme} helpType={helpType} setShowHelp={setShowHelp} />
          </QuizModal>
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
  menuModal: {
    position: "absolute",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "flex-start",
    borderRadius: 10,
  },
  helpModal: {
    position: "absolute",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "flex-start",
    borderRadius: 10,
  },
});

export default ScreenTemplate;
