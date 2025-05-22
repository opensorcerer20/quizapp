import { Pressable, Switch, Text, View } from "react-native";

export const ReverseDeckButton = ({ txtStyle, isReversed, onClick }) => {
    return (
        <View style={{ display: "flex", height: 30 }}>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                <View
                    style={{
                        width: 50,
                        height: 30,
                    }}
                >
                    <Switch
                        trackColor={{
                            false: "#767577",
                            true: "#81b0ff",
                        }}
                        thumbColor={isReversed ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={onClick}
                        value={isReversed}
                    />
                </View>
                <View
                    style={{
                        width: 150,
                        height: 30,
                        paddingLeft: 10,
                        justifyContent: "center",
                    }}
                >
                    <Pressable onPress={onClick} onLongPress={onClick}>
                        <Text style={txtStyle}>Reverse Q & A</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};
