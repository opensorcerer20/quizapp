import { makeQuestionDataCsv } from "../QuizDeck";

// initial tests courtesy of chatgpt
describe("makeQuestionDataCsv", () => {
  it("parses lines with properly quoted values", () => {
    const input = ['"What is 2+2?","4"'];
    const output = makeQuestionDataCsv(input);
    expect(output).toEqual(["What is 2+2?", "4"]);
  });

  it("parses lines with escaped quoted values", () => {
    const input = ['""What is 2+2?"",""4""'];
    const output = makeQuestionDataCsv(input);
    expect(output).toEqual(['"What is 2+2?"', '"4"']);
  });

  it("parses lines with triple quoted values", () => {
    const input = ['"""What is 2+2?""","""4"""'];
    const output = makeQuestionDataCsv(input);
    expect(output).toEqual(['"What is 2+2?"', '"4"']);
  });

  it("parses lines with simple comma-separated values (no quotes)", () => {
    const input = ["Question,Answer"];
    const output = makeQuestionDataCsv(input);
    expect(output).toEqual(["Question", "Answer"]);
  });

  it("test multiple quote lines", () => {
    const input = ['"What is 3+5?","8"', '"Capital of France","Paris"'];
    const output = makeQuestionDataCsv(input);
    expect(output).toEqual(["What is 3+5?", "8", "Capital of France", "Paris"]);
  });

  it("test multiple non-quote lines", () => {
    const input = ["What is 3+5?,8", "Capital of France,Paris"];
    const output = makeQuestionDataCsv(input);
    expect(output).toEqual(["What is 3+5?", "8", "Capital of France", "Paris"]);
  });

  it("handles mix of quoted and unquoted lines", () => {
    const input = ['"What is 3+5?","8"', "Capital of France,Paris"];
    const output = makeQuestionDataCsv(input);
    expect(output).toEqual(["What is 3+5?", "8", "Capital of France", "Paris"]);
  });

  it("returns an empty array when given empty input", () => {
    const input = [];
    const output = makeQuestionDataCsv(input);
    expect(output).toEqual([]);
  });

  //  it('handles improperly quoted lines gracefully', () => {
  //    const input = ['"Badly quoted line,Still included'];
  //    const output = makeQuestionDataCsv(input);
  //    expect(output).toEqual(['"Badly quoted line', 'Still included']);
  //  });
});
