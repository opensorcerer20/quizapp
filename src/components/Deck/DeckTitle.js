import { StyleSheet, Text, View } from "react-native";

const DeckTitle = ({ deckName, scheme }) => {
  return (
    <View style={{ alignContent: "center", padding: 5 }}>
      <View style={{ alignItems: "center" }}>
        <Text style={[scheme.baseBg, scheme.txt, styles.title]}>Deck: {deckName}</Text>
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
