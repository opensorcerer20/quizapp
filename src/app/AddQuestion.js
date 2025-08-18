import { useEffect, useState } from "react";

import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { MAX_CHAR_LIMIT, NEW_QUESTION_ADDED, SAFE_WIDTH } from "../common/constants";
import { loadDeckFromStorage, loadQuestionsFromStorage, updateDeckQuestionData } from "../common/fileLib";
import { globalStyles } from "../common/lib";
import { getRandomInt, getScheme, sanitizeAll } from "../common/util";
import ConfirmModal from "../components/ConfirmModal";
import DeckTitle from "../components/Deck/DeckTitle";
import { useTheme } from "../components/Providers/ThemeProvider";
import ScreenTemplate from "../components/ScreenTemplate";

const AddQuestion = () => {
  const { deckId } = useLocalSearchParams();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [currentDeck, setCurrentDeck] = useState(null);

  const { theme } = useTheme();
  const scheme = getScheme(theme);

  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim()) return;

    try {
      const currentQuestions = await loadQuestionsFromStorage(deckId);
      if (currentQuestions) {
        const newQuestion = {
          id: getRandomInt(100000, 999999),
          q: sanitizeAll(question.trim()),
          a: sanitizeAll(answer.trim()),
          disabled: false,
        };

        const result = await updateDeckQuestionData(deckId, [...currentQuestions.questions, newQuestion]);
        if (result) {
          router.setParams(NEW_QUESTION_ADDED, true);
          router.back();
        }
      }
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleConfirm = () => {
    router.back();
    setConfirmModalVisible(false);
  };

  const handleCancel = () => {
    setConfirmModalVisible(false);
  };

  const onBackClick = () => {
    if (question.length > 0 || answer.length > 0) {
      setConfirmModalVisible(true);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    const asyncFunc = async () => {
      const result = await loadDeckFromStorage(deckId);
      if (result) {
        setCurrentDeck(result);
      } else {
        setCurrentDeck(null);
      }
    };
    asyncFunc();
  }, [deckId]);

  return (
    <ScreenTemplate title={"Add Question"} showBack={true} onBackClick={onBackClick}>
      {currentDeck && <DeckTitle deckName={currentDeck.name} scheme={scheme} />}
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View>
          <Text style={styles.label}>Question</Text>
          <TextInput
            style={globalStyles.textField}
            placeholder="Question"
            placeholderTextColor="#aaaaaa"
            value={question}
            onChangeText={setQuestion}
            maxLength={MAX_CHAR_LIMIT}
          />
        </View>
        <View>
          <Text style={styles.label}>Answer</Text>
          <TextInput
            style={globalStyles.textField}
            placeholder="Answer"
            placeholderTextColor="#aaaaaa"
            value={answer}
            onChangeText={setAnswer}
            maxLength={MAX_CHAR_LIMIT}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={onBackClick}
            onLongPress={onBackClick}
            style={[globalStyles.button, scheme.disabled, styles.buttonStyle]}
          >
            <Text style={[scheme.buttonTxt, { fontSize: 16, fontWeight: "bold" }]}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleSubmit}
            onLongPress={handleSubmit}
            style={[globalStyles.button, scheme.buttonBg, styles.buttonStyle]}
          >
            <Text style={[scheme.buttonTxt, { fontSize: 16, fontWeight: "bold" }]}>Add Question</Text>
          </Pressable>
        </View>
        <ConfirmModal
          scheme={scheme}
          confirmModalVisible={confirmModalVisible}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
        />
      </KeyboardAvoidingView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: SAFE_WIDTH * 0.9,
    marginTop: 20,
  },
  buttonStyle: {
    alignItems: "center",
  },
});

export default AddQuestion;
