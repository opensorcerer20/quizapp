import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import {
  clipWideString,
  getStrWidth,
} from "../../common/constants";
import { useLocale } from "../Providers/TranslationProvider";
import TextNormal from "../TextNormal";

const DeckTitle = ({ deckName, scheme, showEdit = false, onEditPress = () => {} }) => {
  const { getLocalString } = useLocale();
  const nameWidth = getStrWidth(deckName);
  const safeDeckName = nameWidth > 260 ? clipWideString(deckName, 260) + "..." : deckName;

  return (
    <View style={{ alignContent: "center", padding: 5 }}>
      <View style={{ alignItems: "center" }}>
        <View style={[scheme.bgPrimary, styles.title, { flexDirection: "row" }]}>
          <TextNormal style={[scheme.txt, styles.titleTxt]}>
            {getLocalString("Deck")}: {safeDeckName}
          </TextNormal>
          {showEdit && (
            <Pressable onPress={onEditPress}>
              <MaterialCommunityIcons
                name="pencil"
                size={26}
                color={scheme.txt.color}
                style={{ marginLeft: 10 }}
                testID="edit-icon"
              />
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
