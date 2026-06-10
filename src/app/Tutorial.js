import { useRef, useState } from "react";

import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { IS_MOBILE, SAFE_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH } from "../common/constants";
import { getScheme } from "../common/util";
import { useTheme } from "../components/Providers/ThemeProvider";

const { width } = Dimensions.get("window");

const lightlist = require("../../assets/tutorial/lightlist.png");
const adddeck = require("../../assets/tutorial/adddeck.png");
const reviewdeck_1q = require("../../assets/tutorial/reviewdeck_1q.png");
const decksettings = require("../../assets/tutorial/decksettings.png");
const replaytutorial = require("../../assets/tutorial/replaytutorial.png");
const slidetodelete = require("../../assets/tutorial/slidetodelete.png");

const PAGES = [
  { content: "Welcome to your Flashcard Library!" },
  { content: "You can store several flash card decks", img: lightlist },
  { content: "Swipe left to delete a deck", img: slidetodelete },
  { content: "Click the + button to add a deck", img: adddeck },
  { content: "Click on a deck to go through the flash cards", img: reviewdeck_1q },
  { content: "Click on a deck gear to change deck settings", img: decksettings },
  { content: "Click the menu to replay this tutorial.", img: replaytutorial },
];

export default function TutorialOrig({ onClose }) {
  const [page, setPage] = useState(0);
  const flatListRef = useRef(null);
  const { theme } = useTheme();
  const scheme = getScheme(theme);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setPage(viewableItems[0].index);
  }).current;

  return (
    <View style={styles.phoneWrapper}>
      <View style={styles.phoneShell}>
        <View style={[styles.container, scheme.bg]}>
          <FlatList
            ref={flatListRef}
            data={PAGES}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={true}
            renderItem={({ item, key }) => {
              return (
                <View key={key} style={styles.page}>
                  {item.img && (
                    <Image
                      // Use require with the relative path to your image
                      source={item.img}
                      style={{
                        width: 225,
                        height: 450,
                        borderWidth: 2,
                        borderRadius: 10,
                        borderColor: scheme.txt.color,
                      }}
                      resizeMethod="scale"
                    />
                  )}
                  <Text style={[scheme.txt, styles.text, { height: 100 }]}>{item.content}</Text>
                </View>
              );
            }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          />
          {/* <View style={styles.dotsContainer}>
            {PAGES.map((_, i) => (
              <View key={i} style={[styles.dot, { opacity: i === page ? 1 : 0.3 }]} />
            ))}
          </View> */}
          <View style={[styles.dotsContainer, { bottom: 50 }]}>
            <MaterialCommunityIcons
              name="chevron-triple-right"
              size={36}
              color={scheme.txt.color}
              testID="next-page-icon"
            />
          </View>
          <View>
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={[styles.doneText, scheme.link]}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    height: 400,
  },
  page: {
    width: SAFE_WIDTH + 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingTop: 20,
  },
  text: {
    fontSize: 24,
    textAlign: "center",
    marginHorizontal: 20,
    marginVertical: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 60,
    width: "100%",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    margin: 6,
  },
  doneButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    padding: 10,
  },
  doneText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phoneWrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingVertical: IS_MOBILE ? 0 : 24,
    paddingHorizontal: IS_MOBILE ? 0 : 24,
  },
  phoneShell: {
    width: "100%",
    maxWidth: SCREEN_WIDTH,
    minHeight: SCREEN_HEIGHT,
    maxHeight: SCREEN_HEIGHT,
    flex: 1,
    backgroundColor: "#121212",
    borderRadius: IS_MOBILE ? 0 : 28,
    overflow: "hidden",
    borderWidth: IS_MOBILE ? 0 : 1,
    borderColor: "#333",
  },
});
