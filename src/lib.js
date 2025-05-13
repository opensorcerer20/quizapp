import { Pressable, StyleSheet, Text } from "react-native";

export const MyButton = ({ buttonText, onPress }) => {
    const noop = () => {};
    return (
        <Pressable style={styles.button} onPress={onPress ?? noop}>
            <Text style={styles.buttonText}>{buttonText ?? "Next"}</Text>
        </Pressable>
    );
};

export const schemes = {
    schemeDark: {
        bg: {
            backgroundColor: "#222222",
        },
        bg2: {
            backgroundColor: "#444444",
        },
        txt: {
            color: "#dddddd",
        },
        deck: {
            backgroundColor: "#393939",
            borderBottomColor: "#222",
        },
    },
    schemeLight: {
        bg: {
            backgroundColor: "#dddddd",
        },
        bg2: {
            backgroundColor: "#aaaaaa",
        },
        txt: {
            color: "#333333",
        },
        deck: {
            backgroundColor: "#f9f9f9",
            borderBottomColor: "#ddd",
        },
    },
};

export const buttonStyles = {
    button: {
        backgroundColor: "darkblue",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
    },
};

const styles = StyleSheet.create({
    ...buttonStyles,
    ...schemes,
});
