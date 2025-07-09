import { useState } from "react";

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { SAFE_MARGIN, SAFE_WIDTH } from "../common/constants";
import { getScheme } from "../common/util";
import { useTheme } from "../components/Providers/ThemeProvider";
import AppMenu, { APP_MENU_WIDTH } from "./AppMenu";
import Background from "./Background";
import HelpMenu, { HELP_MODAL_WIDTH } from "./HelpMenu";
import { useLocale } from "./Providers/TranslationProvider";
import QuizModal from "./QuizModal";

const ScreenTemplate = ({ title = null, showBack = true, helpType = null, hideButtons = false, children }) => {
  const { width } = Dimensions.get("window");

  const { getLocalString } = useLocale();
  const [showHelp, setShowHelp] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { theme } = useTheme();
  const scheme = getScheme(theme);

  const showHelpButton = !hideButtons && helpType !== null;

  // console.log("showmenu " + JSON.stringify(showMenu));

  return (
    <>
      <View style={[styles.container, scheme.bgPrimary, scheme.txt]}>
        <StatusBar style={Platform.OS === "android" ? "inverted" : "auto"} />
        <Background theme={theme}>
          {/* start toolbar */}
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
                  <MaterialCommunityIcons name="arrow-left" size={24} color={scheme.txt.color} />
                </Pressable>
              )}
              {!showBack && (
                <Pressable onPress={() => setShowMenu(!showMenu)}>
                  <MaterialCommunityIcons name="menu" size={24} color={scheme.txt.color} />
                </Pressable>
              )}
            </View>

            <View style={{ flex: 8 }}>
              <Text style={[scheme.txt, { fontSize: 16 }]}>{title || getLocalString("Flashcard Library")}</Text>
            </View>
            <View style={{ flex: 2, alignItems: "flex-end", marginRight: 15 }}>
              {showHelpButton && (
                <Pressable onPress={() => setShowHelp(!showHelp)}>
                  <MaterialCommunityIcons name="help" size={24} color={scheme.txt.color} />
                </Pressable>
              )}
            </View>
          </View>

          {/* AppMenuModal */}
          <QuizModal
            modalVisible={showMenu}
            handleModalClickAway={() => setShowMenu(false)}
            modalContainerStyle={[
              styles.menuModal,
              {
                top: Platform.OS === "ios" ? 100 : 50,
                left: 20,
                width: APP_MENU_WIDTH,
              },
              scheme.baseBg,
              { borderColor: scheme.bgAccent2.backgroundColor, borderWidth: 1 },
            ]}
          >
            <AppMenu scheme={scheme} />
          </QuizModal>

          {/* HelpModal */}
          <QuizModal
            modalVisible={showHelp}
            handleModalClickAway={() => setShowHelp(false)}
            modalContainerStyle={[
              styles.helpModal,
              {
                top: Platform.OS === "ios" ? 100 : 50,
                left: SAFE_WIDTH / 2 - HELP_MODAL_WIDTH / 2 + SAFE_MARGIN / 2,
                width: HELP_MODAL_WIDTH,
              },
              scheme.baseBg,
              { borderColor: scheme.bgAccent2.backgroundColor, borderWidth: 1 },
            ]}
          >
            <HelpMenu scheme={scheme} helpType={helpType} setShowHelp={setShowHelp} />
          </QuizModal>
          {/* end toolbar */}
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
  // @todo move to AppMenuModal
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
  // @todo move to HelpModal
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
