import { MAX_QUESTIONS, MIME_TYPE_CSV } from "../../common/constants";
import { loadAllDecks, saveDeckData, saveDeckListData } from "../../common/fileLib";
import { getRandomInt, sanitizeAll } from "../../common/util";
import { parseRawCsv } from "./parseCsv";

export const emptyQuestion = {
  id: null,
  q: null,
  a: null,
  disabled: false,
};

export const makeQuestionObject = (id, question, answer, disabled = false) => {
  return {
    id,
    q: question,
    a: answer,
    disabled,
  };
};

export const emptyDeck = {
  id: null,
  name: null,
  createdAt: null,
};

export const makeNewDeck = (id, name) => {
  let deck = JSON.parse(JSON.stringify(emptyDeck));
  deck.id = id;
  deck.name = name;
  deck.createdAt = Date.now();
  return deck;
};

export const makeNewDeckData = (id, questions) => {
  if (typeof id === "number" && Array.isArray(questions) && questions.length > 0) {
    return {
      id,
      questions,
    };
  }

  return false;
};

// randomize questions
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#46545530
export const randomizeQBag = (bag) => {
  return bag
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

// @todo handle all new deck imports (or at least new deck creation via textarea)
export const importNewDeck = async (title, questionData) => {
  const deckListData = await loadAllDecks();
  // generate deck id that doesnt already exist
  let newDeckId;
  let limit = 0;
  do {
    newDeckId = getRandomInt(100000, 999999);
    limit++;
  } while (deckListData.filter((deck) => deck.id === newDeckId).length > 0 && limit < 10);
  if (limit >= 10) {
    console.log("loop limit for deck id, last id: " + newDeckId);
    return;
  }

  const newQuestionArray = getQuestionObjectsFromRawData("text", questionData);

  const newDeckName = title;
  const newDeck = makeNewDeck(newDeckId, sanitizeAll(newDeckName));
  const newDeckData = makeNewDeckData(newDeckId, newQuestionArray);

  let newDeckListData = deckListData.slice();

  newDeckListData.push(newDeck);

  await saveDeckData(newDeck.id, newDeckData);
  const result = await saveDeckListData(newDeckListData);
  if (result !== true) {
    console.log("error saving new deck");
  }
  return result;
};

export const getFileData = async (fileData) => {
  // need to determine what type is
  const fileResponse = await fetch(fileData.uri); // returns Response object
  const rawQuestionData = await fileResponse.text();

  const mimeType = MIME_TYPE_CSV.indexOf(fileData.mimeType) > -1 ? "csv" : "text";

  return getQuestionObjectsFromRawData(mimeType, rawQuestionData);
};

export const getQuestionObjectsFromRawData = (mimeType, rawQuestionData) => {
  let questions = [];

  // clean input that could have \r\n, remove empty lines
  const splitLines = rawQuestionData.split("\n");
  questions = splitLines.map((datum) => datum.trim()).filter((datum) => datum.length > 0);
  questions.map((line) => sanitizeAll(line));

  // plain text does not require additional processing (at this time)
  if (mimeType === "csv") {
    // @todo parse csv here
    questions = parseRawCsv(rawQuestionData, 2);
    questions = questions.flat(); // change [[1, 2],[3, 4]]] to [1,2,3,4]
  }
  // else assume text

  return makeQuestionObjects(questions);
};

/**
 * assumes array of lines with alternating question/answer
 *
 * csv is converted to alternating line format via parseCsv
 * @param {*} questionData
 * @returns
 */
export const makeQuestionObjects = (questionData) => {
  // assume even number with question/answer pairs
  if (questionData.length % 2 === 1) {
    // pop odd row off of the end
    questionData.pop();
  }

  // make {q,a} object array
  let questions = [];
  for (let i = 0; i < questionData.length; i += 2) {
    if (questions.length <= MAX_QUESTIONS) {
      const question = questionData[i];
      const answer = questionData[i + 1];
      questions.push(makeQuestionObject(questions.length + 1, question, answer));
    }
  }

  return questions;
};
