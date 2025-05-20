import { StyleSheet } from "react-native";
import { lightDarkStyles } from "./lib";
import { useState } from "react";
import { useTheme } from "./Providers/ThemeProvider";
import { Appbar, Menu } from "react-native-paper";
import { THEMES, VIEWS } from "./constants";

const Toolbar = ({ title, currentView, backCallback }) => {
    // const [visible, setVisible] = useState(false);
    // const openMenu = () => setVisible(true);
    // const closeMenu = () => setVisible(false);

    const { theme, toggleTheme } = useTheme();
    const scheme =
        theme === THEMES.dark ? styles.schemeDark : styles.schemeLight;
    let themeIcon = null;
    if (theme) {
        themeIcon =
            theme === THEMES.dark ? "moon-waning-crescent" : "weather-sunny";
    }

    const showBack = currentView === VIEWS.quizView;
    return (
        <Appbar.Header>
            {showBack && <Appbar.BackAction onPress={() => backCallback()} />}
            {/* {!showBack && (
                <Appbar.Action
                    icon="menu"
                    onPress={() => {}}
                    isLeading={true}
                />
            )} */}
            <Appbar.Content title={title || "Flashcard Library"} />
            {themeIcon && (
                <Appbar.Action icon={themeIcon} onPress={toggleTheme} />
            )}
            {/* <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <Appbar.Action icon="dots-vertical" onPress={openMenu} />
                }
            >
                <Menu.Item
                    onPress={() => {
                        console.log("Option 1 was pressed");
                    }}
                    title="Option 1"
                />
                <Menu.Item
                    onPress={() => {
                        console.log("Option 2 was pressed");
                    }}
                    title="Option 2"
                />
                <Menu.Item
                    onPress={() => {
                        console.log("Option 3 was pressed");
                    }}
                    title="Option 3"
                    disabled
                />
            </Menu> */}
        </Appbar.Header>
    );
};

const styles = StyleSheet.create({
    toolbar: {},
    ...lightDarkStyles,
});

export default Toolbar;
