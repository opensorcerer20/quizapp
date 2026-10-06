import { fidelityCases } from "../../__fixtures__/fidelityCases";
import { DECK_DATA_KEY, DECK_QA_KEY } from "../constants";
import {
  getFlag,
  loadAllDecks,
  loadDeckData,
  loadDeckFromStorage,
  loadQuestionsFromStorage,
  saveDeckData,
  removeStorageData,
  saveDeckListData,
  setFlag,
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

describe("storage round-trips", () => {
  const deckId = 123456;
  const deck = { id: deckId, name: "Test deck", createdAt: 1 };
  const questions = [{ id: 1, q: "q1", a: "a1", disabled: false }];

  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("saves and loads the deck list", () => {
    expect(saveDeckListData([deck])).toBe(true);

    expect(loadAllDecks()).toEqual([deck]);
    expect(loadDeckFromStorage(deckId)).toEqual(deck);
  });

  it("loadDeckFromStorage returns false for an id not in the list", () => {
    saveDeckListData([deck]);

    expect(loadDeckFromStorage(999999)).toBe(false);
  });

  it("loadDeckFromStorage returns false when there is no deck list", () => {
    expect(loadDeckFromStorage(deckId)).toBe(false);
  });

  it("setFlag and getFlag round-trip a value", () => {
    expect(setFlag("someFlag", { on: true })).toBe(true);

    expect(getFlag("someFlag")).toEqual({ on: true });
  });

  it("getFlag returns false for a missing key", () => {
    expect(getFlag("missingFlag")).toBe(false);
  });

  describe("loadDeckData", () => {
    it("returns the deck and its question data", () => {
      saveDeckListData([deck]);
      saveDeckData(deckId, { id: deckId, questions });

      expect(loadDeckData(deckId)).toEqual([deck, { id: deckId, questions }]);
    });

    it("returns [null, []] when there is no deck list", () => {
      saveDeckData(deckId, { id: deckId, questions });

      expect(loadDeckData(deckId)).toEqual([null, []]);
    });

    it("returns [null, []] when the deck is not in the list", () => {
      saveDeckListData([{ ...deck, id: 999999 }]);
      saveDeckData(deckId, { id: deckId, questions });

      expect(loadDeckData(deckId)).toEqual([null, []]);
    });

    it("returns [null, []] when the deck has no questions", () => {
      saveDeckListData([deck]);
      saveDeckData(deckId, { id: deckId, questions: [] });

      expect(loadDeckData(deckId)).toEqual([null, []]);
    });

    it("returns [null, []] without a deck id", () => {
      expect(loadDeckData(undefined)).toEqual([null, []]);
    });
  });

  describe("removeStorageData", () => {
    it("removes the key", () => {
      saveDeckListData([deck]);

      expect(removeStorageData(DECK_DATA_KEY)).toBe(true);
      expect(localStorage.getItem(DECK_DATA_KEY)).toBeNull();
    });

    it("returns false when removeItem throws", () => {
      jest.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
        throw new Error("removeItem failed");
      });

      let result;
      expect(() => {
        result = removeStorageData(DECK_DATA_KEY);
      }).not.toThrow();
      expect(result).toBe(false);
    });
  });

  it.each([
    { label: "setFlag", call: () => setFlag(1, true) },
    { label: "getFlag", call: () => getFlag(1) },
    { label: "removeStorageData", call: () => removeStorageData(1) },
  ])("$label returns false for a non-string key", ({ call }) => {
    expect(call()).toBe(false);
  });
});
