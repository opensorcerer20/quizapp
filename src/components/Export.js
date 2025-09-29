import { useState } from "react";

import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, Pressable, View } from "react-native";
import Toast from "react-native-toast-message";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { getExportData } from "../common/fileLib";
import { getScheme } from "../common/util";
import ConfirmModal from "./ConfirmModal";
import { useTheme } from "./Providers/ThemeProvider";

const Export = () => {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const { theme } = useTheme();
  const scheme = getScheme(theme);

  const onConfirmExport = async () => {
    // const content = "This is the content of my text file.";
    const content = await getExportData();
    // console.log(">>> content " + JSON.stringify(content, null, 2));
    let file;
    try {
      // export decks as question 1\nanswer1\netc\netc, with 2 blank lines between decks, no titles
      file = new File(
        Paths.cache,
        `export_${new Date()
          .toISOString()
          .replace("T", "_")
          .replace(/[^0-9_]/g, "")}.txt`
      );
      if (!file.exists) {
        file.create(); // can throw an error if the file already exists or no permission to create it
        file.write(content);
        Toast.show({
          type: "success",
          text1: "File created",
        });
      } else {
        Toast.show({
          type: "success",
          text1: "File already exists",
        });
      }
    } catch (error) {
      console.error("Error writing file:", error);
      Toast.show({
        type: "error",
        text1: "Error writing file",
      });
    }

    if (file) {
      try {
        if (!(await Sharing.isAvailableAsync())) {
          Alert.alert("Sharing not available", "Your device does not support sharing.");
          return;
        }

        await Sharing.shareAsync(file.uri, { mimeType: "text/plain", dialogTitle: "Share this file!" });
      } catch (error) {
        console.error("Error sharing file:", error);
        Alert.alert("Sharing error", "Failed to share the file.");
      }
    }
    setConfirmModalVisible(false);
  };

  return (
    <>
      <View style={{ marginLeft: "auto", marginRight: 0 }}>
        <Pressable onPress={() => setConfirmModalVisible(true)}>
          <MaterialCommunityIcons name="file-download-outline" size={30} color={scheme.txt.color} />
        </Pressable>
      </View>
      <ConfirmModal
        scheme={scheme}
        confirmModalVisible={confirmModalVisible}
        handleCancel={() => setConfirmModalVisible(false)}
        handleConfirm={onConfirmExport}
        message="Would you like to export all flash cards?"
        confirmLabel="Export"
      />
    </>
  );
};

export default Export;
