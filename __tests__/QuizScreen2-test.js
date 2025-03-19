import { render } from "@testing-library/react-native";

import QuizScreen2 from "../QuizScreen2";

import { makeQuestionObject } from "../util.js";
import { cleanDeckSettings } from "../QuizDeck";

describe("<QuizScreen2 />", () => {
  it("shows empty deck text when no deck data", () => {
    const deckData = [];
    const deckSettings = cleanDeckSettings();
    const { getByText } = render(<QuizScreen2 colorScheme="light" deckData={deckData} deckSettings={deckSettings} />);

    getByText("No deck data");
  });

  it("shows card with num left when deck data set", () => {
    const deckData = [
      makeQuestionObject("question 1", "answer 1")
    ];
    const deckSettings = cleanDeckSettings();
    const { getByText } = render(<QuizScreen2 colorScheme="light" deckData={deckData} deckSettings={deckSettings} />);

    getByText("num left");
  });
});
