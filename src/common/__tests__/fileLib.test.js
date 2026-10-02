import { fidelityCases } from "../../__fixtures__/fidelityCases";
import { DECK_QA_KEY } from "../constants";
import {
  loadDeckFromStorage,
  loadQuestionsFromStorage,
  saveDeckData,
  saveDeckListData,
  updateDeckQuestionData,
} from "../fileLib";

describe("fileLib storage error handling", () => {
  const deckId = 123456;

  beforeEach(() => {
    localStorage.clear();
    // seed existing deck data before setItem is forced to throw
    localStorage.setItem(`${DECK_QA_KEY}_${deckId}`, JSON.stringify({ id: deckId, questions: [] }));
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("saveDeckListData returns false when setItem throws", () => {
    let result;
    expect(() => {
      result = saveDeckListData([{ id: deckId, name: "Test deck" }]);
    }).not.toThrow();
    expect(result).toBe(false);
  });

  it("saveDeckData returns false when setItem throws", () => {
    let result;
    expect(() => {
      result = saveDeckData(deckId, { id: deckId, questions: [] });
    }).not.toThrow();
    expect(result).toBe(false);
  });

  it("updateDeckQuestionData returns false when setItem throws", () => {
    let result;
    expect(() => {
      result = updateDeckQuestionData(deckId, [{ q: "question", a: "answer" }]);
    }).not.toThrow();
    expect(result).toBe(false);
  });
});

// logStorageError is not exported, so it is exercised through loadDeckFromStorage, which passes deckId through unchecked
describe("logStorageError", () => {
  let logSpy;

  beforeEach(() => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("getItem failed");
    });
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([
    { label: "a string id", id: "abc123", expected: " abc123" },
    { label: "a number id", id: 123456, expected: " 123456" },
    { label: "a zero id", id: 0, expected: " 0" },
    { label: "an empty string id", id: "", expected: " " },
    { label: "an omitted id", id: undefined, expected: "" },
    { label: "a null id", id: null, expected: "" },
    { label: "an object id", id: { id: 1 }, expected: "" },
  ])("logs $label", ({ id, expected }) => {
    loadDeckFromStorage(id);
    expect(logSpy).toHaveBeenCalledWith(`Error loading deck data with id${expected}: getItem failed`);
  });

  it("does not throw and returns false", () => {
    let result;
    expect(() => {
      result = loadDeckFromStorage(123456);
    }).not.toThrow();
    expect(result).toBe(false);
  });
});

describe("storage fidelity", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it.each(fidelityCases)("$id round-trips $expected unchanged", ({ expected }) => {
    const deckId = 123456;
    const questions = [{ id: 1, q: expected, a: expected, disabled: false }];

    saveDeckData(deckId, { id: deckId, questions });

    expect(loadQuestionsFromStorage(deckId)).toEqual({ id: deckId, questions });
  });
});
