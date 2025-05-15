import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { lightDarkStyles } from "./lib";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Appbar, Menu } from "react-native-paper";
import { VIEWS } from "./QuizApp";

const Toolbar = ({ title, currentView, backCallback }) => {
    // const [visible, setVisible] = useState(false);
    // const openMenu = () => setVisible(true);
    // const closeMenu = () => setVisible(false);

    // const { theme, toggleTheme } = useTheme();
    // const scheme = theme === "dark" ? styles.schemeDark : styles.schemeLight;

    const showBack = currentView === VIEWS.quizView;
    return (
        <Appbar.Header>
            {showBack && <Appbar.BackAction onPress={() => backCallback()} />}
            {!showBack && (
                <Appbar.Action
                    icon="menu"
                    onPress={() => {}}
                    isLeading={true}
                />
            )}
            <Appbar.Content title={title || "Flashcard Library"} />
            {/* <Appbar.Action icon="calendar" onPress={() => {}} /> */}

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

            {/* light dark theme below
        // <View
        //     style={[
        //         styles.toolbar,
        //         { flexDirection: "row" },
        //         scheme.bg,
        //         scheme.txt,
        //     ]}
        // >
        //     {showBack && (
        //         <>
        //             <Pressable
        //                 style={{ flex: 1 }}
        //                 onPress={() => backCallback()}
        //             >
        //                 <Ionicons
        //                     name="arrow-back-circle-outline"
        //                     size={32}
        //                     color={scheme.txt.color}
        //                 ></Ionicons>
        //             </Pressable>
        //             <Text
        //                 style={[
        //                     {
        //                         flex: 4,
        //                         paddingLeft: "10px",
        //                         alignItems: "center",
        //                     },
        //                     scheme.txt,
        //                 ]}
        //             >
        //                 {title}
        //             </Text>
        //         </>
        //     )}
        //     {!showBack && <View style={{ flex: 5 }} />}
        //     <View style={{ flex: 1, padding: 5 }}>
        //         <Switch
        //             trackColor={{ false: "#767577", true: "#81b0ff" }}
        //             thumbColor={theme === "dark" ? "#f5dd4b" : "#f4f3f4"}
        //             ios_backgroundColor="#3e3e3e"
        //             onValueChange={toggleTheme}
        //             value={theme === "dark"}
        //         />
        //     </View>
        // </View>
        */}
        </Appbar.Header>
    );
};

const styles = StyleSheet.create({
    toolbar: {},
    ...lightDarkStyles,
});

export default Toolbar;
