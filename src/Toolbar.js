import { Pressable, StyleSheet, Text, View } from "react-native";
import { schemes } from "./lib";
import Ionicons from "@expo/vector-icons/Ionicons";

const Toolbar = ({ title, showBack, backCallback, colorScheme = "light" }) => {
    const scheme =
        colorScheme === "dark" ? styles.schemeDark : styles.schemeLight;
    return (
        <View style={[styles.toolbar, { flexDirection: "row" }, scheme.bg]}>
            <View style={[{ flex: 1 }, { flexDirection: "row" }]}>
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
                        <Text style={{ flex: 1, paddingLeft: "10px" }}>
                            {title}
                        </Text>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    toolbar: {},
    ...schemes,
});

export default Toolbar;
