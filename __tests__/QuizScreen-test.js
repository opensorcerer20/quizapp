import * as React from "react";

import {
    fireEvent,
    render,
    screen,
    userEvent,
} from "@testing-library/react-native";

jest.useFakeTimers();

import QuizScreen, { QuizScreenOrder } from "../QuizScreen";

import { makeQuestionObject } from "../util.js";

jest.useFakeTimers(userEvent);

/*
// use this for callback calls
  expect(onSubmit).toHaveBeenCalledWith({
    '1': { q: 'q1', a: 'a1' },
    '2': { q: 'q2', a: 'a2' },
  });
*/

describe("<QuizScreen />", () => {
    it("shows empty deck text when no deck data", () => {
        const currentDeck = [];
        const { getByText } = render(<QuizScreen currentDeck={currentDeck} />);

        expect(getByText("No deck data")).toBeTruthy();
    });

    it("sets up screen to show first question with one more left", () => {
        const currentDeck = [
            makeQuestionObject(1, "question 1", "answer 1"),
            makeQuestionObject(2, "question 2", "answer 2"),
        ];

        // use sequential order so we know which question happens first
        const { getByText } = render(
            <QuizScreen
                currentDeck={currentDeck}
                questionOrder={QuizScreenOrder.SEQUENTIAL}
            />
        );

        // test question card with quesiton showing
        expect(getByText("question 1")).toBeTruthy();
        expect(getByText("answer 1")).toBeTruthy();

        // test num left
        expect(getByText("num left 1")).toBeTruthy();
    });

    it("next question when next is clicked", () => {
        const currentDeck = [
            makeQuestionObject(1, "question 1", "answer 1"),
            makeQuestionObject(2, "question 2", "answer 2"),
        ];

        // use sequential order so we know which question happens first
        const { getByText, getByTestId } = render(
            <QuizScreen
                currentDeck={currentDeck}
                questionOrder={QuizScreenOrder.SEQUENTIAL}
            />
        );

        expect(getByText("question 1")).toBeTruthy();
        expect(getByText("answer 1")).toBeTruthy();

        // test next question
        // @todo this "getByTestId" for "button" seems very unreliable
        // note: "button-next" does not work, even though it's in the output
        fireEvent.press(getByTestId("button"));
        expect(getByText("question 2")).toBeTruthy();
        expect(getByText("answer 2")).toBeTruthy();
        expect(getByText("num left 0")).toBeTruthy();

        // test that deck refreshes with zero questions left
        fireEvent.press(getByTestId("button"));
        expect(getByText("question 1")).toBeTruthy();
        expect(getByText("answer 1")).toBeTruthy();
        expect(getByText("num left 1")).toBeTruthy();
    });

    // note: did not test random on purpose; no simple/quick way to do so
});
