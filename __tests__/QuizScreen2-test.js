import { render } from "@testing-library/react-native";

import QuizScreen2 from "../QuizScreen2";

import { makeQuestionObject } from "../util.js";

describe("<QuizScreen2 />", () => {
  it("shows empty deck text when no deck data", () => {
    const currentDeck = [];
    const { getByText } = render(<QuizScreen2 currentDeck={null} />);

    getByText("No deck data");
  });

  it("shows card with num left when deck data set", () => {
    const currentDeck = [
      makeQuestionObject("question 1", "answer 1")
    ];
    const { getByText } = render(<QuizScreen2 currentDeck={currentDeck} />);

    getByText("num left");
  });
});
