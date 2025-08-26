import { makeQuestionObjects } from "../src/components/Deck/QuizDeck";

// @todo deal with "import asyncstorage..."

describe("makeQuestionObjects", () => {
  it("generates question/answer array", () => {
    const questionData = ["sí", "yes"];
    expect(makeQuestionObjects(questionData)).toEqual([{ id: 1, q: "sí", a: "yes", disabled: false }]);
  });

  // this now happens OUTSIDE this method
  //   it("handles html", () => {
  //     const questionData = ["<b>sí</b>", "yes"];
  //     expect(makeQuestionObjects(questionData)).toEqual([{ id: 1, q: "sí", a: "yes" }]);
  //   });

  it("handles one extra element", () => {
    const questionData = ["sí", "yes", "extra"];
    expect(makeQuestionObjects(questionData)).toEqual([{ id: 1, q: "sí", a: "yes", disabled: false }]);
  });
});
