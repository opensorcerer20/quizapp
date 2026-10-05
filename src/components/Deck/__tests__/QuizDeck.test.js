import { casesForPath } from "../../../__fixtures__/fidelityCases";
import { MAX_QUESTIONS } from "../../../common/constants";
import { getQuestionObjectsFromRawData, makeQuestionObjects } from "../QuizDeck";

const makeLines = (pairCount) => Array.from({ length: pairCount }, (_, i) => [`q${i + 1}`, `a${i + 1}`]).flat();

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

describe("MAX_QUESTIONS limit", () => {
  it.each([
    [MAX_QUESTIONS - 1, MAX_QUESTIONS - 1],
    [MAX_QUESTIONS, MAX_QUESTIONS],
    [MAX_QUESTIONS + 1, MAX_QUESTIONS],
  ])("%i pairs make %i questions", (pairCount, expectedCount) => {
    expect(makeQuestionObjects(makeLines(pairCount))).toHaveLength(expectedCount);
  });

  it("caps a 60 pair text import", () => {
    const questions = getQuestionObjectsFromRawData("text", makeLines(60).join("\n"));

    expect(questions).toHaveLength(MAX_QUESTIONS);
    expect(questions.at(-1)).toEqual({
      id: MAX_QUESTIONS,
      q: `q${MAX_QUESTIONS}`,
      a: `a${MAX_QUESTIONS}`,
      disabled: false,
    });
  });
});
