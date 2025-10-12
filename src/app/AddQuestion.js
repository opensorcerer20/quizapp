import {
  useEffect,
  useState,
} from "react";

import {
  router,
  useLocalSearchParams,
} from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import {
  MAX_CHAR_LIMIT,
  NEW_QUESTION_ADDED,
} from "../common/constants";
import {
  loadDeckFromStorage,
  loadQuestionsFromStorage,
  updateDeckQuestionData,
} from "../common/fileLib";
import { globalStyles } from "../common/lib";
import {
  getRandomInt,
  getScheme,
  sanitizeAll,
} from "../common/util";
import CancelSubmit from "../components/CancelSubmit";
import ConfirmModal from "../components/ConfirmModal";
import DeckTitle from "../components/Deck/DeckTitle";
import { useTheme } from "../components/Providers/ThemeProvider";
import ScreenTemplate from "../components/ScreenTemplate";
import TextNormal from "../components/TextNormal";

const AddQuestion = () => {
  const { deckId } = useLocalSearchParams();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
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
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onBackClick = () => {
    if (question.length > 0 || answer.length > 0) {
      setModalVisible(true);
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
          <TextNormal style={styles.label}>Question</TextNormal>
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
          <TextNormal style={styles.label}>Answer</TextNormal>
          <TextInput
            style={globalStyles.textField}
            placeholder="Answer"
            placeholderTextColor="#aaaaaa"
            value={answer}
            onChangeText={setAnswer}
            maxLength={MAX_CHAR_LIMIT}
          />
        </View>
        <CancelSubmit
          scheme={scheme}
          handleSubmit={handleSubmit}
          onBackClick={onBackClick}
          submitLabel="Add Question"
          submitDisabled={question.length === 0 || answer.length === 0}
        />
        <ConfirmModal
          message="You have unsaved data, do you want to discard it?"
          scheme={scheme}
          modalVisible={modalVisible}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
          confirmLabel="Discard"
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
});

export default AddQuestion;
