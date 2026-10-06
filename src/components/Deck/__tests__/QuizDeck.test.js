import { casesForPath } from "../../../__fixtures__/fidelityCases";
import { MAX_QUESTIONS } from "../../../common/constants";
import { getQuestionObjectsFromRawData, makeQuestionObjects, randomizeQBag } from "../QuizDeck";

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

describe("makeQuestionObjects", () => {
  it("numbers ids from 1 in pair order", () => {
    expect(makeQuestionObjects(makeLines(3))).toEqual([
      { id: 1, q: "q1", a: "a1", disabled: false },
      { id: 2, q: "q2", a: "a2", disabled: false },
      { id: 3, q: "q3", a: "a3", disabled: false },
    ]);
  });

  it("drops a trailing unpaired line", () => {
    expect(makeQuestionObjects(["q1", "a1", "q2"])).toEqual([{ id: 1, q: "q1", a: "a1", disabled: false }]);
  });

  it("does not mutate its input", () => {
    const lines = ["q1", "a1", "q2"];

    makeQuestionObjects(lines);

    expect(lines).toEqual(["q1", "a1", "q2"]);
  });

  it.each([
    { label: "no lines", lines: [] },
    { label: "a single line", lines: ["q1"] },
  ])("returns [] for $label", ({ lines }) => {
    expect(makeQuestionObjects(lines)).toEqual([]);
  });
});

describe("getQuestionObjectsFromRawData", () => {
  it("skips blank lines and \\r in a text import", () => {
    const questions = getQuestionObjectsFromRawData("text", "\nq1\r\na1\r\n\n   \nq2\na2\n");

    expect(questions).toEqual([
      { id: 1, q: "q1", a: "a1", disabled: false },
      { id: 2, q: "q2", a: "a2", disabled: false },
    ]);
  });

  it("drops a trailing unpaired line in a text import", () => {
    expect(getQuestionObjectsFromRawData("text", "q1\na1\nq2")).toHaveLength(1);
  });

  it("drops csv rows with too few columns", () => {
    const questions = getQuestionObjectsFromRawData("csv", "q1,a1\nonly\nq2,a2\n");

    expect(questions).toEqual([
      { id: 1, q: "q1", a: "a1", disabled: false },
      { id: 2, q: "q2", a: "a2", disabled: false },
    ]);
  });

  // current behavior: the parser's error row becomes a question
  it("keeps an unparseable csv row as an error question", () => {
    const questions = getQuestionObjectsFromRawData("csv", 'q1,a1\n"q2,a2\n');

    expect(questions).toEqual([
      { id: 1, q: "q1", a: "a1", disabled: false },
      { id: 2, q: "Could not parse csv", a: '"q2,a2', disabled: false },
    ]);
  });
});

describe("randomizeQBag", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the same items", () => {
    const bag = Array.from({ length: 20 }, (_, i) => i);

    expect(randomizeQBag(bag).sort((a, b) => a - b)).toEqual(bag);
  });

  it("does not mutate its input", () => {
    const bag = ["a", "b", "c", "d"];
    const copy = bag.slice();
    const result = randomizeQBag(bag);

    expect(bag).toEqual(copy);
    expect(result).not.toBe(bag);
  });

  it("orders items by their random sort key", () => {
    jest.spyOn(Math, "random").mockReturnValueOnce(0.9).mockReturnValueOnce(0.1).mockReturnValueOnce(0.5);

    expect(randomizeQBag(["a", "b", "c"])).toEqual(["b", "c", "a"]);
  });

  it("returns [] for an empty bag", () => {
    expect(randomizeQBag([])).toEqual([]);
  });
});
