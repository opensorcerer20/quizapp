import { Pressable, StyleSheet, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import TextNormal from "../TextNormal";

const DeckTitle = ({ deckName, scheme, showEdit = false, onEditPress = () => {} }) => {
  return (
    <View style={{ alignContent: "center", padding: 5 }}>
      <View style={{ alignItems: "center" }}>
        <View style={[scheme.bgPrimary, styles.title, { flexDirection: "row" }]}>
          <TextNormal style={[scheme.txt, styles.titleTxt]}>Deck: {deckName}</TextNormal>
          {showEdit && (
            <Pressable onPress={onEditPress}>
              <MaterialCommunityIcons name="pencil" size={26} color={scheme.txt.color} style={{ marginLeft: 10 }} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  titleTxt: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DeckTitle;
