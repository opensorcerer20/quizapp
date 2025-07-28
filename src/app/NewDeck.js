import { useState } from "react";

import { router } from "expo-router";
import { Button, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";

import { SAFE_WIDTH } from "../common/constants";
import { getScheme } from "../common/util";
import { importNewDeck } from "../components/Deck/QuizDeck";
import { useTheme } from "../components/Providers/ThemeProvider";
import ScreenTemplate from "../components/ScreenTemplate";

const NewDeck = () => {
  const [title, setTitle] = useState("");
  const [questionData, setQuestionData] = useState("");

  const { theme } = useTheme();
  const scheme = getScheme(theme);

  const updateText = (value) => {
    const numLines = value.split("\n").length;
    if (numLines <= 100) {
      setQuestionData(value);
    }
  };

  const handleSubmit = async (title, questionData) => {
    // handle submit
    const result = await importNewDeck(title, questionData);
    if (result) {
      router.replace({ pathname: "/", params: { NEW_DECK_ADDED: true } });
    }
  };

  return (
    <ScreenTemplate showBack={true}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Text style={[scheme.txt, { width: SAFE_WIDTH * 0.9, marginHorizontal: "auto", marginVertical: 16 }]}>
          Add a short descriptive title for the new deck.
        </Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Deck Title"
          placeholderTextColor="#aaaaaa"
          value={title}
          onChangeText={setTitle}
          maxLength={64}
        />
        <Text style={[scheme.txt, { width: SAFE_WIDTH * 0.9, marginHorizontal: "auto", marginVertical: 16 }]}>
          Add questions and answers, with a question on lines 1, 3, 5, etc, and answers on lines 2, 4, 6, etc
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder={"Question 1\nAnswer 1\nQuestion 2\nAnswer 2"}
          placeholderTextColor="#aaaaaa"
          value={questionData}
          onChangeText={updateText}
          multiline={true}
          numberOfLines={100}
          textAlignVertical="top"
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Submit"
            onPress={() => handleSubmit(title, questionData)}
            disabled={questionData.length === 0 || title.length === 0}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 18,
    backgroundColor: "#fafafa",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontFamily: "Courier",
    fontSize: 16,
    backgroundColor: "#fafafa",
    marginBottom: 16,
    minHeight: 120,
    maxHeight: 300,
  },
  buttonContainer: {
    marginTop: 8,
  },
});

export default NewDeck;
