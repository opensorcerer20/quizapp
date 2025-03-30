import * as React from 'react';

import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';

jest.useFakeTimers();

import QuizScreen2, { QuizScreenOrder } from "../QuizScreen2";

import { makeQuestionObject } from "../util.js";

jest.useFakeTimers(userEvent);

/*
// use this for callback calls
  expect(onSubmit).toHaveBeenCalledWith({
    '1': { q: 'q1', a: 'a1' },
    '2': { q: 'q2', a: 'a2' },
  });
*/

describe("<QuizScreen2 />", () => {

  it("shows empty deck text when no deck data", () => {
    const currentDeck = [];
    const { getByText } = render(<QuizScreen2 currentDeck={currentDeck} />);

    expect(getByText("No deck data")).toBeTruthy();
  });

  it("sets up screen to show first question with one more left", () => {
    const currentDeck = [
      makeQuestionObject("question 1", "answer 1"),
      makeQuestionObject("question 2", "answer 2"),
    ];

    // use sequential order so we know which question happens first
    const { getByText } = render(<QuizScreen2 currentDeck={currentDeck} questionOrder={QuizScreenOrder.SEQUENTIAL} />);

    // test question card with quesiton showing
    expect(getByText("question 2")).toBeTruthy();
    // @todo test answer hidden
    expect(getByText("answer 2")).toBeTruthy();

    // @todo test click to show answer

    // test num left
    expect(getByText("num left 1")).toBeTruthy();
  });

  it("next question when next is clicked", () => {
    const currentDeck = [
      makeQuestionObject("question 1", "answer 1"),
      makeQuestionObject("question 2", "answer 2"),
    ];

    // use sequential order so we know which question happens first
    const { getByText, getByTestId } = render(<QuizScreen2 currentDeck={currentDeck} questionOrder={QuizScreenOrder.SEQUENTIAL} />);

    expect(getByText("question 2")).toBeTruthy();
    expect(getByText("answer 2")).toBeTruthy();

    // test next question
    // @todo this "getByTestId" for "button" seems very unreliable
    fireEvent.press(getByTestId("button"));
    expect(getByText("question 1")).toBeTruthy();
    expect(getByText("answer 1")).toBeTruthy();
    expect(getByText("num left 0")).toBeTruthy();

    // test that deck refreshes with zero questions left
    fireEvent.press(getByTestId("button"));
    expect(getByText("question 2")).toBeTruthy();
    expect(getByText("answer 2")).toBeTruthy();
    expect(getByText("num left 1")).toBeTruthy();
  });

  // test random sort

  /*
  viewing question
- response
  - show ui
    - back button
    - question card
    - next question button
*/



  /*
question showing, card clicked
- response
  - flip card to show answer
*/



  /*
answer showing, card clicked
- response
  - flip card to show question
*/



  /*
next button clicked, > 0 questions left
- response
  - pop question from bag array
  - (now) viewing question
*/



  /*
next button clicked, 0 questions left
- response
  - calls fillQuestionBag()
  - shows the first question after re-randomizing questions
*/



// - when currentDeck changes, empty question bag



// - if question bag empty, fill

});
