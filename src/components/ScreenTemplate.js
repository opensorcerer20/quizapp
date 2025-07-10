import { useState } from "react";

import { router } from "expo-router";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { getScheme } from "../common/util";
import { useTheme } from "../components/Providers/ThemeProvider";
import AppMenuModal from "./AppMenuModal";
import Background from "./Background";
import HelpMenuModal from "./HelpMenuModal";
import { useLocale } from "./Providers/TranslationProvider";

const ScreenTemplate = ({ title = null, showBack = true, helpType = null, hideButtons = false, children }) => {
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
        <StatusBar barStyle={"default"} />
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

          <AppMenuModal scheme={scheme} showMenu={showMenu} setShowMenu={setShowMenu} />
          <HelpMenuModal showHelp={showHelp} setShowHelp={setShowHelp} scheme={scheme} helpType={helpType} />

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
});

export default ScreenTemplate;
