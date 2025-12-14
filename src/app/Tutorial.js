import { useRef, useState } from "react";

import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

const PAGES = [
  { key: "1", content: "Welcome to the tutorial!" },
  { key: "2", content: "Swipe left or right to navigate." },
  { key: "3", content: "You're ready to start using the app!" },
];

export default function Tutorial({ onClose }) {
  const [page, setPage] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setPage(viewableItems[0].index);
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={PAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <Text style={styles.text}>{item.content}</Text>
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
      <View style={styles.dotsContainer}>
        {PAGES.map((_, i) => (
          <View key={i} style={[styles.dot, { opacity: i === page ? 1 : 0.3 }]} />
        ))}
      </View>
      <TouchableOpacity style={styles.doneButton} onPress={onClose}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  page: {
    width,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  text: {
    fontSize: 24,
    textAlign: "center",
    marginHorizontal: 20,
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
    bottom: 20,
    right: 30,
    padding: 10,
  },
  doneText: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "bold",
  },
});
