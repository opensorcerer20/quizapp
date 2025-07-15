import { useState } from "react";

import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import AppMenuModal from "./AppMenuModal";
import HelpMenuModal from "./HelpMenuModal";
import { useLocale } from "./Providers/TranslationProvider";

const Toolbar = ({ title, showBack, scheme, helpType, hideButtons }) => {
  const { getLocalString } = useLocale();
  const [showHelp, setShowHelp] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const showHelpButton = !hideButtons && helpType !== null;
  return (
    <>
      <View style={[scheme.bgAccent3, styles.container]}>
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
          <Text style={scheme.txt}>{title || getLocalString("Flashcard Library")}</Text>
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
