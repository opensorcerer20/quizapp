import { StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { schemes } from "./lib";

const QuizSettings = ({pickOrder, setPickOrder, pickMode, setPickMode, cardMode, setCardMode}) => {

    return (
        <View>
            <SegmentedButtons
                style={{ padding: 5 }}
                value={pickOrder}
                onValueChange={setPickOrder}
                buttons={[
                    {
                        value: 'random',
                        label: 'Random',
                    },
                    {
                        value: 'sequential',
                        label: 'Sequential',
                    },
                ]}
            />
            <SegmentedButtons
                style={{ padding: 5 }}
                value={pickMode}
                onValueChange={setPickMode}
                buttons={[
                    {
                        value: 'bag',
                        label: 'Grab Bag',
                    },
                    {
                        value: 'continuous',
                        label: 'Continuous',
                    },
                ]}
            />
            <SegmentedButtons
                style={{ padding: 5 }}
                value={cardMode}
                onValueChange={setCardMode}
                buttons={[
                    {
                        value: 'repeat',
                        label: 'Repeat',
                    },
                    {
                        value: 'once',
                        label: 'Once Only'
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    ...schemes
});

export default QuizSettings;
