import { useState } from "react";

import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { THEMES } from "../common/constants";
import { getScheme } from "../common/util";
import AppMenuModal from "./AppMenuModal";
import FileHelpModal from "./FileHelpModal";
import HelpMenuModal from "./HelpMenuModal";
import { useTheme } from "./Providers/ThemeProvider";
import { useLocale } from "./Providers/TranslationProvider";
import TextNormal from "./TextNormal";

const Toolbar = ({ title, showBack, helpType, hideButtons, onBackClick }) => {
  const { getLocalString } = useLocale();
  const [showHelp, setShowHelp] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showFileHelp, setShowFileHelp] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const themeIcon = theme === THEMES.dark ? "moon-waning-crescent" : "weather-sunny";
  const scheme = getScheme(theme);

  const showFileHelpModal = () => {
    setShowMenu(false);

    setTimeout(() => {
      setShowFileHelp(true);
    }, 300);
  };

  const onClickNew = () => {
    setShowMenu(false);
    router.navigate({
      pathname: "NewDeck",
      params: {},
    });
  };

  const showHelpButton = !hideButtons && helpType !== null;
  const buttonFlex = showHelpButton ? { flexDirection: "row" } : {};
  return (
    <>
      <View style={[scheme.bgPrimary, styles.container]}>
        <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
          {showBack && (
            <Pressable onPress={onBackClick}>
              <MaterialCommunityIcons name="arrow-left" size={28} color={scheme.txt.color} />
            </Pressable>
          )}
          {!showBack && (
            <Pressable onPress={() => setShowMenu(!showMenu)}>
              <MaterialCommunityIcons name="menu" size={28} color={scheme.txt.color} />
            </Pressable>
          )}
        </View>

        <View style={{ flex: 8 }}>
          <TextNormal style={[scheme.txt, { fontSize: 20 }]}>{title || getLocalString("Flashcard Library")}</TextNormal>
        </View>
        <View style={[{ flex: 2, alignItems: "flex-end", marginRight: 15 }, buttonFlex]}>
          <Pressable style={showHelpButton ? { flex: 1 } : {}} onPress={toggleTheme}>
            <MaterialCommunityIcons name={themeIcon} size={28} color={scheme.txt.color} />
          </Pressable>
          {showHelpButton && (
            <Pressable style={{ flex: 1 }} onPress={() => setShowHelp(!showHelp)}>
              <MaterialCommunityIcons name="help" size={28} color={scheme.txt.color} />
            </Pressable>
          )}
        </View>
      </View>

      <AppMenuModal
        showModal={showMenu}
        setShowModal={setShowMenu}
        onClickHelp={() => showFileHelpModal()}
        onClickNew={() => onClickNew()}
        scheme={scheme}
      />
      <HelpMenuModal showModal={showHelp} setShowModal={setShowHelp} scheme={scheme} helpType={helpType} />
      <FileHelpModal showModal={showFileHelp} setShowModal={setShowFileHelp} scheme={scheme} />
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
