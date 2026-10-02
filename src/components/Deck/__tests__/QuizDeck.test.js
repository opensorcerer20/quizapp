import { casesForPath } from "../../../__fixtures__/fidelityCases";
import { getQuestionObjectsFromRawData } from "../QuizDeck";

describe("import fidelity", () => {
  it.each(casesForPath("text"))("$id keeps $input from a text import", ({ input, expected }) => {
    const questions = getQuestionObjectsFromRawData("text", `${input}\n${input}\n`);

    expect(questions).toEqual([{ id: 1, q: expected, a: expected, disabled: false }]);
  });

  it.each(casesForPath("csv"))("$id keeps $input from a csv import", ({ input, expected }) => {
    const questions = getQuestionObjectsFromRawData("csv", `${input},${input}\n`);

    expect(questions).toEqual([{ id: 1, q: expected, a: expected, disabled: false }]);
  });
});
