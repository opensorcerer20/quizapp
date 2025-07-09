import { Pressable, StyleSheet, Text, View } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import { SAFE_WIDTH } from "../common/constants";

const HelpContentDeck = ({ width, scheme, onCloseClick }) => {
  return (
    <View style={{ width: width }}>
      <View style={styles.helpHeader}>
        <Text style={[styles.helpTitle, scheme.txt, { flex: 11 }]}>Deck Help</Text>
        <Pressable onPress={onCloseClick}>
          <FontAwesome6
            name="square-xmark"
            size={24}
            color={scheme.txt.color}
            style={{ textAlign: "right", flex: 1 }}
          />
        </Pressable>
      </View>
      <View style={styles.helpItem}>
        <Text style={[styles.helpParaIcon, scheme.txt]}>
          <Entypo name="switch" size={24} color={scheme.txt.color} />
        </Text>
        <Text style={[styles.helpPara, scheme.txt]}>
          "Reverse Q & A" to change the card "Answer" to "Question" and vice versa.
        </Text>
      </View>

      <View style={styles.helpItem}>
        <Text style={[styles.helpParaIcon, scheme.txt]}>
          <Entypo name="switch" size={24} color={scheme.txt.color} />
        </Text>
        <Text style={[styles.helpPara, scheme.txt]}>
          "Turn Card Off" to disable the card the next time the deck is shuffled.
        </Text>
      </View>

      <View style={styles.helpItem}>
        <Text style={[styles.helpParaIcon, scheme.txt]}>
          <Entypo name="reply" size={24} color={scheme.txt.color} />
        </Text>
        <Text style={[styles.helpPara, scheme.txt]}>Replay the deck in the same order</Text>
      </View>

      <View style={styles.helpItem}>
        <Text style={[styles.helpParaIcon, scheme.txt]}>
          <Entypo name="shuffle" size={24} color={scheme.txt.color} />
        </Text>
        <Text style={[styles.helpPara, scheme.txt]}>Shuffle the deck in a new order</Text>
      </View>
    </View>
  );
};

const HelpContentList = ({ width, scheme, onCloseClick }) => {
  return (
    <View style={{ width: width }}>
      <View style={styles.helpHeader}>
        <Text style={[styles.helpTitle, scheme.txt, { flex: 11 }]}>Deck List Help</Text>
        <Pressable onPress={onCloseClick}>
          <FontAwesome6
            name="square-xmark"
            size={24}
            color={scheme.txt.color}
            style={{ textAlign: "right", flex: 1 }}
          />
        </Pressable>
      </View>
      <View style={styles.helpItem}>
        <Text style={[styles.helpParaIcon, scheme.txt]}>
          <Entypo name="plus" size={24} color={scheme.txt.color} />
        </Text>
        <Text style={[styles.helpPara, scheme.txt]}>Add a new deck</Text>
      </View>
      <View style={styles.helpItem}>
        <Text style={[styles.helpParaIcon, scheme.txt]}>
          <Entypo name="text" size={24} color={scheme.txt.color} />
        </Text>
        <Text style={[styles.helpPara, scheme.txt]}>
          TXT files should alternate between question (odd lines) and answers (even lines)
        </Text>
      </View>
      <View style={styles.helpItem}>
        <Text style={[styles.helpParaIcon, scheme.txt]}>
          <MaterialCommunityIcons name="table" size={24} color={scheme.txt.color} />
        </Text>
        <Text style={[styles.helpPara, scheme.txt]}>
          CSV files should be saved as CSV files, with questions in column 1 or "A" and answers in column 2 or "B"
        </Text>
      </View>
      <View style={styles.helpItem}>
        <Text style={[styles.helpParaIcon, scheme.txt]}>
          <Octicons name="alert" size={24} color={scheme.txt.color} />
        </Text>
        <Text style={[styles.helpPara, scheme.txt]}>No more than 50 questions per deck</Text>
      </View>
      <View style={styles.helpItem}>
        <Text style={[styles.helpParaIcon, scheme.txt]}>
          <Octicons name="alert" size={24} color={scheme.txt.color} />
        </Text>
        <Text style={[styles.helpPara, scheme.txt]}>No more than 20 decks may be active</Text>
      </View>
      <View style={styles.helpItem}>
        <Text style={[styles.helpParaIcon, scheme.txt]}>
          <SimpleLineIcons name="eye" size={24} color={scheme.txt.color} />
        </Text>
        <Text style={[styles.helpPara, scheme.txt]}>"View" a deck to turn cards on and off</Text>
      </View>
    </View>
  );
};

const HelpMenu = ({ scheme, helpType = "list", setShowHelp }) => {
  const unknownType = ["list", "deck"].indexOf(helpType) === -1;
  return (
    <>
      {helpType === "list" && (
        <HelpContentList width={HELP_MODAL_WIDTH} scheme={scheme} onCloseClick={() => setShowHelp(false)} />
      )}
      {helpType === "deck" && (
        <HelpContentDeck width={HELP_MODAL_WIDTH} scheme={scheme} onCloseClick={() => setShowHelp(false)} />
      )}
      {unknownType && (
        <View>
          <Text>Unknown help type</Text>
        </View>
      )}
    </>
  );
};

export const HELP_MODAL_WIDTH = Math.min(SAFE_WIDTH, 300);
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
