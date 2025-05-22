import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

const NavButton = ({ enabled, onClick, buttonText }) => {
    return (
        <Button
            style={[styles.button, { height: 40, margin: 10 }]}
            buttonColor={enabled ? "#0000ff" : "#999999"}
            textColor="#e0e0e0"
            onPress={enabled ? () => onClick() : () => {}}
        >
            {buttonText}
        </Button>
    );
};

export const DeckNav = ({
    prevEnabled,
    onPrevClick,
    nextEnabled,
    onNextClick,
    onResetClick,
    onStartOverClick,
}) => {
    return (
        <>
            <View style={{ display: "flex", padding: 20, marginTop: 10 }}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <NavButton
                        enabled={prevEnabled}
                        onClick={onPrevClick}
                        buttonText="< Previous"
                    />
                    <NavButton
                        enabled={nextEnabled}
                        onClick={onNextClick}
                        buttonText="Next >"
                    />
                </View>
            </View>
            <Button
                style={{ marginTop: 10 }}
                buttonColor="#0000ff"
                textColor="#e0e0e0"
                onPress={onStartOverClick}
            >
                Start Over
            </Button>
            <Button
                style={{ marginTop: 10 }}
                buttonColor="#0000ff"
                textColor="#e0e0e0"
                onPress={onResetClick}
            >
                &lt;-- Re-mix Questions
            </Button>
        </>
    );
};

const styles = StyleSheet.create({
    button: { width: "50%", margin: 5 },
});
