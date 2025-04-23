import { StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { MyButton, schemes } from "./lib";
import { useState } from "react";

const QuizSettings = ({ deckSettings, updateDeckSettings }) => {
  const [pickOrder, setPickOrder] = useState(deckSettings.pickOrder);
  const [pickMode, setPickMode] = useState(deckSettings.pickMode);
  const [cardMode, setCardMode] = useState(deckSettings.cardMode);
  const settingsChanged =
    JSON.stringify(deckSettings) !==
    JSON.stringify({ pickOrder, pickMode, cardMode });
  const enabled = false;
  return (
    <View>
      {enabled && (
        <>
          <SegmentedButtons
            style={{ padding: 5 }}
            value={pickOrder}
            onValueChange={setPickOrder}
            buttons={[
              {
                value: "random",
                label: "Random",
              },
              {
                value: "sequential",
                label: "Sequential",
              },
            ]}
          />
          <SegmentedButtons
            style={{ padding: 5 }}
            value={pickMode}
            onValueChange={setPickMode}
            buttons={[
              {
                value: "bag",
                label: "Grab Bag",
              },
              {
                value: "continuous",
                label: "Continuous",
              },
            ]}
          />
          <SegmentedButtons
            style={{ padding: 5 }}
            value={cardMode}
            onValueChange={setCardMode}
            buttons={[
              {
                value: "repeat",
                label: "Repeat",
              },
              {
                value: "once",
                label: "Once Only",
              },
            ]}
          />
          {settingsChanged && (
            <MyButton
              buttonText="Apply Settings"
              onPress={() => updateDeckSettings(pickOrder, pickMode, cardMode)}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ...schemes,
});

export default QuizSettings;
