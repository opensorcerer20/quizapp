import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

import { getScheme } from "../common/util";
import { useTheme } from "./Providers/ThemeProvider";
import QuizModal from "./QuizModal";

const HelpContent = ({ width, helpType, scheme, onCloseClick }) => {
  const contentWidth = width - 70;
  return (
    <View style={{ width: width }}>
      {helpType === "deck" && (
        <>
          <View style={{ flexDirection: "row", alignItems: "baseline", width: width - 30 }}>
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
          <View style={{ flexDirection: "row", width: contentWidth }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Entypo name="switch" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>
              "Reverse Q & A" to change the card "Answer" to "Question" and vice versa.
            </Text>
          </View>

          <View style={{ flexDirection: "row", width: contentWidth }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Entypo name="switch" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>
              "Turn Card Off" to disable the card the next time the deck is shuffled.
            </Text>
          </View>

          <View style={{ flexDirection: "row", width: contentWidth }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Entypo name="reply" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>Replay the deck in the same order</Text>
          </View>

          <View style={{ flexDirection: "row", width: contentWidth }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Entypo name="shuffle" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>Shuffle the deck in a new order</Text>
          </View>
        </>
      )}

      {helpType !== "deck" && (
        <>
          <View style={{ flexDirection: "row", alignItems: "baseline", width: width - 30 }}>
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
          <View style={{ flexDirection: "row", width: contentWidth }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Entypo name="plus" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>Add a new deck</Text>
          </View>
          <View style={{ flexDirection: "row", width: contentWidth }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Entypo name="text" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>
              TXT files should alternate between question (odd lines) and answers (even lines)
            </Text>
          </View>
          <View style={{ flexDirection: "row", width: contentWidth }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <MaterialCommunityIcons name="table" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>
              CSV files should be saved as CSV files, with questions in column 1 or "A" and answers in column 2 or "B"
            </Text>
          </View>
          <View style={{ flexDirection: "row", width: contentWidth }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Octicons name="alert" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>No more than 50 questions per deck</Text>
          </View>
          <View style={{ flexDirection: "row", width: contentWidth }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Octicons name="alert" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>No more than 20 decks may be active</Text>
          </View>
          <View style={{ flexDirection: "row", width: contentWidth }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <SimpleLineIcons name="eye" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>"View" a deck to turn cards on and off</Text>
          </View>
        </>
      )}
    </View>
  );
};

const HelpContent2 = ({ width, helpType, scheme, onCloseClick }) => {
  return (
    <>
      {helpType === "deck" && (
        <>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
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
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Entypo name="switch" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>
              "Reverse Q & A" to change the card "Answer" to "Question" and vice versa.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Entypo name="switch" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>
              "Turn Card Off" to disable the card the next time the deck is shuffled.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Entypo name="reply" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>Replay the deck in the same order</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Entypo name="shuffle" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>Shuffle the deck in a new order</Text>
          </View>
        </>
      )}

      {helpType !== "deck" && (
        <>
          <View style={{ flexDirection: "row", alignItems: "baseline", width: width }}>
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
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Entypo name="plus" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>Add a new deck</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Entypo name="text" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>
              TXT files should alternate between question (odd lines) and answers (even lines)
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <MaterialCommunityIcons name="table" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>
              CSV files should be saved as CSV files, with questions in column 1 or "A" and answers in column 2 or "B"
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Octicons name="alert" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>No more than 50 questions per deck</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <Octicons name="alert" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>No more than 20 decks may be active</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.helpParaIcon, scheme.txt]}>
              <SimpleLineIcons name="eye" size={24} color={scheme.txt.color} />
            </Text>
            <Text style={[styles.helpPara, scheme.txt]}>"View" a deck to turn cards on and off</Text>
          </View>
        </>
      )}
    </>
  );
};

const HelpMenu = ({ helpType = "list", showHelp, setShowHelp }) => {
  const { width } = Dimensions.get("window");
  const SAFE_MARGIN = Math.round(width / 20); // 5% width
  const SAFE_WIDTH = width - Math.round(width / 20); // 95% width

  const { theme } = useTheme();
  const scheme = getScheme(theme);

  const helpModalWidth = Math.min(SAFE_WIDTH, 300);

  return (
    <QuizModal
      modalVisible={showHelp}
      handleModalClickAway={() => setShowHelp(false)}
      modalContainerStyle={[
        styles.helpContent,
        {
          top: 100,
          left: SAFE_WIDTH / 2 - helpModalWidth / 2 + SAFE_MARGIN / 2,
          width: helpModalWidth,
        },
        scheme.baseBg,
        { borderColor: scheme.bgAccent2.backgroundColor, borderWidth: 1 },
      ]}
    >
      <HelpContent width={helpModalWidth} helpType={helpType} scheme={scheme} onCloseClick={() => setShowHelp(false)} />
    </QuizModal>
  );
};

const styles = StyleSheet.create({
  helpContent: {
    position: "absolute",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "flex-start",
    borderRadius: 10,
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
