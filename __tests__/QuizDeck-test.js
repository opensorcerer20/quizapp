import { makeQuestionDataCsv, makeQuestionObjects } from "../src/Deck/QuizDeck";

describe("makeQuestionDataCsv", () => {
  it("parses lines with no quotes", () => {
    const questions = ["sí,yes"];
    expect(makeQuestionDataCsv(questions, 2)).toEqual(["sí", "yes"]);
  });

  it("parses lines with no quotes and 3 items to 2 items", () => {
    const questions = ["sí,yes,extra"];
    expect(makeQuestionDataCsv(questions, 2)).toEqual(["sí", "yes"]);
  });

  it("parses lines with full quotes", () => {
    const questions = ['"sí","yes"'];
    expect(makeQuestionDataCsv(questions, 2)).toEqual(["sí", "yes"]);
  });

  it("parses lines with full quotes and 3 items to 2 items", () => {
    const questions = ['"sí","yes","extra"'];
    expect(makeQuestionDataCsv(questions, 2)).toEqual(["sí", "yes"]);
  });

  // it("parses lines with partial quotes", () => {
  //     const questions = ['"sí",yes'];
  //     expect(makeQuestionDataCsv(questions, 2)).toEqual(["sí", "yes"]);
  // });

  // it("parses lines with partial quotes 2", () => {
  //     const questions = ['sí,"yes"'];
  //     expect(makeQuestionDataCsv(questions, 2)).toEqual(["sí", "yes"]);
  // });

  it("handles improperly quoted lines gracefully", () => {
    const questions = ['"Badly quoted line,Still included'];
    expect(makeQuestionDataCsv(questions)).toEqual(["could not parse csv line", '"Badly quoted line,Still included']);
  });

  it("handles improperly quoted lines gracefully 2", () => {
    const questions = ['Badly quoted line",Still included'];
    expect(makeQuestionDataCsv(questions)).toEqual(["could not parse csv line", 'Badly quoted line",Still included']);
  });

  it("handles improperly quoted lines gracefully 3", () => {
    const questions = ['Badly quot"ed line,Still included'];
    expect(makeQuestionDataCsv(questions)).toEqual(["could not parse csv line", 'Badly quot"ed line,Still included']);
  });

  it("parses lines with full quotes and commas", () => {
    const questions = ['"sí,","yes"'];
    expect(makeQuestionDataCsv(questions, 2)).toEqual(["sí,", "yes"]);
  });

  // it("parses lines with partial quotes and commas", () => {
  //     const questions = ['"sí,",yes'];
  //     expect(makeQuestionDataCsv(questions, 2)).toEqual(["sí,", "yes"]);
  // });

  // it("parses lines with partial quotes and commas 2", () => {
  //     const questions = ['sí,",yes"'];
  //     expect(makeQuestionDataCsv(questions, 2)).toEqual(["sí", ",yes"]);
  // });

  it("parses lines with triple escaped quotes", () => {
    const questions = ['"""sí""","""yes"""'];
    expect(makeQuestionDataCsv(questions, 2)).toEqual(['"sí"', '"yes"']);
  });

  it("parses lines with triple escaped quotes and commas", () => {
    const questions = ['"""sí,""","""yes"""'];
    expect(makeQuestionDataCsv(questions, 2)).toEqual(['"sí,"', '"yes"']);
  });

  it("parses lines with slash escaped quotes", () => {
    const questions = ['"\\"sí\\"","\\"yes\\""'];
    expect(makeQuestionDataCsv(questions, 2)).toEqual(['"sí"', '"yes"']);
  });

  it("parses lines with slash escaped quotes and commas", () => {
    const questions = ['"\\"sí,\\"","\\"yes\\""'];
    expect(makeQuestionDataCsv(questions, 2)).toEqual(['"sí,"', '"yes"']);
  });

  it("handles html", () => {
    const questions = ["<b>sí</b>,yes"];
    expect(makeQuestionDataCsv(questions, 2)).toEqual(["sí", "yes"]);
  });
});

describe("makeQuestionObjects", () => {
  it("generates question/answer array", () => {
    const questionData = ["sí", "yes"];
    expect(makeQuestionObjects(questionData)).toEqual([{ id: 1, q: "sí", a: "yes" }]);
  });

  it("handles html", () => {
    const questionData = ["<b>sí</b>", "yes"];
    expect(makeQuestionObjects(questionData)).toEqual([{ id: 1, q: "sí", a: "yes" }]);
  });

  it("handles one extra element", () => {
    const questionData = ["sí", "yes", "extra"];
    expect(makeQuestionObjects(questionData)).toEqual([{ id: 1, q: "sí", a: "yes" }]);
  });
});
