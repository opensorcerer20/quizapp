import { DECK_QA_KEY } from "../constants";
import { loadDeckFromStorage, saveDeckData, saveDeckListData, updateDeckQuestionData } from "../fileLib";

// util.js pulls in sanitize-html (ESM), which jest does not transform; fileLib only needs getRandomInt
jest.mock("../util", () => ({ getRandomInt: jest.fn(() => 123456) }));

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

  it("logs a string id", () => {
    loadDeckFromStorage("abc123");
    expect(logSpy).toHaveBeenCalledWith("Error loading deck data with id abc123: getItem failed");
  });

  it("logs a number id", () => {
    loadDeckFromStorage(123456);
    expect(logSpy).toHaveBeenCalledWith("Error loading deck data with id 123456: getItem failed");
  });

  it("logs a zero id", () => {
    loadDeckFromStorage(0);
    expect(logSpy).toHaveBeenCalledWith("Error loading deck data with id 0: getItem failed");
  });

  it("logs an empty string id", () => {
    loadDeckFromStorage("");
    expect(logSpy).toHaveBeenCalledWith("Error loading deck data with id : getItem failed");
  });

  it("logs no id when the id is omitted", () => {
    loadDeckFromStorage();
    expect(logSpy).toHaveBeenCalledWith("Error loading deck data with id: getItem failed");
  });

  it("logs no id for a null id", () => {
    loadDeckFromStorage(null);
    expect(logSpy).toHaveBeenCalledWith("Error loading deck data with id: getItem failed");
  });

  it("logs no id for an object id", () => {
    loadDeckFromStorage({ id: 1 });
    expect(logSpy).toHaveBeenCalledWith("Error loading deck data with id: getItem failed");
  });

  it("does not throw and returns false", () => {
    let result;
    expect(() => {
      result = loadDeckFromStorage(123456);
    }).not.toThrow();
    expect(result).toBe(false);
  });
});
