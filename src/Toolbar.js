import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { schemes } from "./lib";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

const Toolbar = ({ title, showBack, backCallback }) => {
    const { theme, toggleTheme } = useTheme();
    const scheme = theme === "dark" ? styles.schemeDark : styles.schemeLight;
    return (
        <View
            style={[
                styles.toolbar,
                { flexDirection: "row" },
                scheme.bg,
                scheme.txt,
            ]}
        >
            {showBack && (
                <>
                    <Pressable
                        style={{ flex: 1 }}
                        onPress={() => backCallback()}
                    >
                        <Ionicons
                            name="arrow-back-circle-outline"
                            size={32}
                            color={scheme.txt.color}
                        ></Ionicons>
                    </Pressable>
                    <Text
                        style={[
                            {
                                flex: 4,
                                paddingLeft: "10px",
                                alignItems: "center",
                            },
                            scheme.txt,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
            {!showBack && <View style={{ flex: 5 }} />}
            <View style={{ flex: 1, padding: 5 }}>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={theme === "dark" ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleTheme}
                    value={theme === "dark"}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    toolbar: {},
    ...schemes,
});

export default Toolbar;
