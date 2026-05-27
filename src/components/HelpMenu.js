import { Pressable, StyleSheet, View } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { SAFE_WIDTH } from "../common/constants";
import { useLocale } from "./Providers/TranslationProvider";
import TextNormal from "./TextNormal";

export const MODAL_WIDTH = Math.min(SAFE_WIDTH, 300);

const HelpHeader = ({ scheme, title, onPress }) => {
  return (
    <View style={styles.helpHeader}>
      <TextNormal style={[scheme.txt, styles.helpTitle, { flex: 11 }]}>{title}</TextNormal>
      <Pressable onPress={onPress}>
        <FontAwesome6 name="square-xmark" size={24} color={scheme.txt.color} style={{ textAlign: "right", flex: 1 }} />
      </Pressable>
    </View>
  );
};

const HelpItem = ({ schemeTxt, icon, text }) => {
  return (
    <View style={styles.helpItem}>
      <TextNormal style={[schemeTxt, styles.helpParaIcon]}>{icon}</TextNormal>
      <TextNormal style={[schemeTxt, styles.helpPara]}>{text}</TextNormal>
    </View>
  );
};

const HelpContent = (helpType, scheme) => {
  const { getLocalString } = useLocale();

  if (helpType === "review") {
    return {
      title: getLocalString("Review Help"),
      items: [
        {
          icon: <MaterialCommunityIcons name="toggle-switch-outline" size={24} color={scheme.txt.color} />,
          text: getLocalString('"Reverse Q & A" to change the card "Answer" to "Question" and vice versa'),
        },
        // {
        //   icon: <MaterialCommunityIcons name="toggle-switch-outline" size={24} color={scheme.txt.color} />,
        //   text: getLocalString('"Turn Card Off" to disable the card the next time the deck is shuffled'),
        // },
        {
          icon: <MaterialCommunityIcons name="chevron-double-right" size={24} color={scheme.txt.color} />,
          text: getLocalString("Flip card over"),
        },
        {
          icon: <FontAwesome6 name="shuffle" size={24} color={scheme.txt.color} />,
          text: getLocalString("Shuffle the deck in a new order"),
        },
        {
          icon: <FontAwesome6 name="reply" size={24} color={scheme.txt.color} />,
          text: getLocalString("Replay the deck in the same order"),
        },
      ],
    };
  }

  if (helpType === "list") {
    return {
      title: getLocalString("Deck List Help"),
      items: [
        {
          icon: <MaterialCommunityIcons name="weather-sunny" size={24} color={scheme.txt.color} />,
          text: getLocalString("Light / Dark theme"),
        },
        {
          icon: <MaterialCommunityIcons name="file-download-outline" size={24} color={scheme.txt.color} />,
          text: getLocalString("Export all deck data"),
        },
        {
          icon: <MaterialCommunityIcons name="cog" size={24} color={scheme.txt.color} />,
          text: getLocalString("View and edit deck settings"),
        },
        {
          icon: <MaterialCommunityIcons name="trash-can-outline" size={24} color={scheme.txt.color} />,
          text: getLocalString("Swipe right to delete"),
        },
        {
          icon: <MaterialCommunityIcons name="plus" size={24} color={scheme.txt.color} />,
          text: getLocalString("Add a new deck"),
        },
        {
          icon: <MaterialCommunityIcons name="alert-outline" size={24} color={scheme.txt.color} />,
          text: getLocalString("No more than 50 questions per deck"),
        },
        {
          icon: <MaterialCommunityIcons name="alert-outline" size={24} color={scheme.txt.color} />,
          text: getLocalString("No more than 20 decks may be active"),
        },
      ],
    };
  }

  if (helpType === "deck") {
    return {
      title: getLocalString("Deck Help"),
      items: [
        {
          icon: <MaterialCommunityIcons name="pencil" size={24} color={scheme.txt.color} />,
          text: getLocalString("Edit deck title"),
        },
        {
          icon: <MaterialCommunityIcons name="eye-outline" size={24} color={scheme.txt.color} />,
          text: getLocalString("Turn cards on and off"),
        },
        {
          icon: <MaterialCommunityIcons name="trash-can-outline" size={24} color={scheme.txt.color} />,
          text: getLocalString("Swipe right to delete"),
        },
        {
          icon: <MaterialCommunityIcons name="plus" size={24} color={scheme.txt.color} />,
          text: getLocalString("Add a new question and answer"),
        },
        {
          icon: <MaterialCommunityIcons name="alert-outline" size={24} color={scheme.txt.color} />,
          text: getLocalString("No more than 50 questions per deck"),
        },
      ],
    };
  }

  return {
    title: getLocalString("Error loading help"),
    items: [],
  };
};

const HelpMenu = ({ scheme, helpType = "list", setShowModal }) => {
  const { title, items } = HelpContent(helpType, scheme);

  return (
    <View style={{ padding: 15 }}>
      <View style={{ width: MODAL_WIDTH }}>
        <HelpHeader scheme={scheme} title={title} onPress={() => setShowModal(false)} />
        {items.length > 0 &&
          items.map((item, key) => <HelpItem key={key} schemeTxt={scheme.txt} icon={item.icon} text={item.text} />)}
        {items.length === 0 && (
          <View>
            <TextNormal>{getLocalString("Unknown help type")}</TextNormal>
          </View>
        )}
      </View>
    </View>
  );
};

const headerWidth = MODAL_WIDTH - 30;
const contentWidth = MODAL_WIDTH - 70;

const styles = StyleSheet.create({
  helpHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    width: headerWidth,
  },
  helpItem: {
    flexDirection: "row",
    width: contentWidth,
    marginVertical: 5,
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
    fontSize: 20,
  },
});

export default HelpMenu;
