import { Pressable, StyleSheet, View } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { SAFE_WIDTH } from "../common/constants";
import TextNormal from "./TextNormal";

export const HELP_MODAL_WIDTH = Math.min(SAFE_WIDTH, 300);

const HelpContent = (helpType, scheme) => {
  // @todo need translations
  // const { getLocalString } = useLocale();
  if (helpType === "deck") {
    return {
      title: "Deck Help",
      items: [
        {
          icon: <MaterialCommunityIcons name="toggle-switch-outline" size={24} color={scheme.txt.color} />,
          text: '"Reverse Q & A" to change the card "Answer" to "Question" and vice versa',
        },
        {
          icon: <MaterialCommunityIcons name="toggle-switch-outline" size={24} color={scheme.txt.color} />,
          text: '"Turn Card Off" to disable the card the next time the deck is shuffled',
        },
        {
          icon: <FontAwesome6 name="reply" size={24} color={scheme.txt.color} />,
          text: "Replay the deck in the same order",
        },
        {
          icon: <FontAwesome6 name="shuffle" size={24} color={scheme.txt.color} />,
          text: "Shuffle the deck in a new order",
        },
      ],
    };
  }

  if (helpType === "list") {
    return {
      title: "Deck Help",
      items: [
        {
          icon: <MaterialCommunityIcons name="plus" size={24} color={scheme.txt.color} />,
          text: "Add a new deck",
        },
        {
          icon: <MaterialCommunityIcons name="alert-outline" size={24} color={scheme.txt.color} />,
          text: "No more than 50 questions per deck",
        },
        {
          icon: <MaterialCommunityIcons name="alert-outline" size={24} color={scheme.txt.color} />,
          text: "No more than 20 decks may be active",
        },
        {
          icon: <MaterialCommunityIcons name="eye-outline" size={24} color={scheme.txt.color} />,
          text: '"View" a deck to turn cards on and off',
        },
      ],
    };
  }

  return {
    title: "Error loading help",
    items: [],
  };
};

const HelpMenu = ({ scheme, helpType = "list", setShowModal }) => {
  const { title, items } = HelpContent(helpType, scheme);

  return (
    <View style={{ padding: 15 }}>
      <View style={{ width: HELP_MODAL_WIDTH }}>
        <View style={styles.helpHeader}>
          <TextNormal style={[styles.helpTitle, scheme.txt, { flex: 11 }]}>{title}</TextNormal>
          <Pressable onPress={() => setShowModal(false)}>
            {/* @todo use space-between */}
            {/* @todo top of help with title and x should be extracted */}
            <FontAwesome6
              name="square-xmark"
              size={24}
              color={scheme.txt.color}
              style={{ textAlign: "right", flex: 1 }}
            />
          </Pressable>
        </View>
        {items.length > 0 &&
          items.map((item, key) => (
            <View key={key} style={styles.helpItem}>
              <TextNormal style={[styles.helpParaIcon, scheme.txt]}>{item.icon}</TextNormal>
              <TextNormal style={[styles.helpPara, scheme.txt]}>{item.text}</TextNormal>
            </View>
          ))}
        {items.length === 0 && (
          <View>
            <TextNormal>Unknown help type</TextNormal>
          </View>
        )}
      </View>
    </View>
  );
};

const headerWidth = HELP_MODAL_WIDTH - 30;
const contentWidth = HELP_MODAL_WIDTH - 70;

const styles = StyleSheet.create({
  helpHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    width: headerWidth,
  },
  helpItem: {
    flexDirection: "row",
    width: contentWidth,
  },
  helpTitle: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 15,
  },
  helpParaIcon: {
    paddingRight: 8,
  },
  helpPara: {
    marginBottom: 10,
  },
});

export default HelpMenu;
