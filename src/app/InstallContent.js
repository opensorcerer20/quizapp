import React, { useState } from "react";

import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { globalStyles } from "../common/lib";
import TextNormal from "../components/TextNormal";

const TABS = ["Android", "iPhone / iPad"];

export default function InstallContent({ scheme, setShowModal }) {
  const defaultTab = Platform.OS === "ios" ? "iPhone / iPad" : "Android";
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <View style={styles.container}>
      <View style={styles.helpHeader}>
        <TextNormal style={[scheme.txt, styles.helpTitle, { flex: 1 }]}>Install this app on your phone</TextNormal>
        <Pressable onPress={() => setShowModal(false)} style={{ width: 30 }}>
          <FontAwesome6
            name="square-xmark"
            size={24}
            color={scheme.txt.color}
            style={{ textAlign: "right" }}
            testID="help-close-button"
          />
        </Pressable>
      </View>
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      {activeTab === "Android" ? (
        <View style={styles.content}>
          <Text style={[scheme.txt, styles.note]}>Using Chrome or Samsung Internet:</Text>
          <Text style={[scheme.txt, styles.step]}>1. Open this website in your browser.</Text>
          <Text style={[scheme.txt, styles.step]}>2. Tap the three-dot menu in the top-right corner.</Text>
          <Text style={[scheme.txt, styles.step]}>
            3. Tap <Text style={styles.bold}>Install app</Text> or <Text style={styles.bold}>Add to Home screen</Text>.
          </Text>
          <Text style={[scheme.txt, styles.step]}>
            4. Tap <Text style={styles.bold}>Install</Text> or <Text style={styles.bold}>Add</Text> to confirm.
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={[scheme.txt, styles.note]}>Using Safari:</Text>
          <Text style={[scheme.txt, styles.step]}>1. Open this website in Safari.</Text>
          <Text style={[scheme.txt, styles.step]}>
            2. Tap the <Text style={styles.bold}>Share</Text> button (square with an arrow) at the bottom of your
            screen.
          </Text>
          <Text style={[scheme.txt, styles.step]}>
            3. Scroll down and tap <Text style={styles.bold}>Add to Home Screen</Text>.
          </Text>
          <Text style={[scheme.txt, styles.step]}>
            4. Tap <Text style={styles.bold}>Add</Text> in the top-right corner.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    maxWidth: 300,
  },
  heading: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 14,
    textAlign: "center",
  },
  tabRow: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: globalStyles.bgBlack.backgroundColor,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: globalStyles.bgWhite.backgroundColor,
  },
  tabActive: {
    backgroundColor: globalStyles.bgBlack.backgroundColor,
  },
  tabText: {
    fontSize: 14,
    color: globalStyles.txtBlack.color,
  },
  tabTextActive: {
    color: globalStyles.txtWhite.color,
    fontWeight: "600",
  },
  content: { gap: 8 },
  note: { fontSize: 13, marginBottom: 4 },
  step: { fontSize: 14, lineHeight: 20 },
  bold: { fontWeight: "600" },
  helpTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 15,
  },
  helpHeader: {
    flexDirection: "row",
  },
});
