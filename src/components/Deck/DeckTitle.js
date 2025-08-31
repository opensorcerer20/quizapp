import { StyleSheet, View } from "react-native";

import TextNormal from "../TextNormal";

const DeckTitle = ({ deckName, scheme }) => {
  return (
    <View style={{ alignContent: "center", padding: 5 }}>
      <View style={{ alignItems: "center" }}>
        <TextNormal style={[scheme.bgAccent3, scheme.txt, styles.title]}>Deck: {deckName}</TextNormal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    borderWidth: 1,
    borderRadius: 5,
    fontWeight: "bold",
    fontSize: 16,
    width: "90%",
    textAlign: "center",
    padding: 10,
  },
});

export default DeckTitle;
