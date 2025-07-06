import { MAX_QUESTIONS, MIME_TYPE_CSV } from "../../common/constants";
import { sanitizeAll } from "../../common/util";
import { parseCsv } from "./parseCsv";

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

export const getFileData = async (fileData) => {
  // need to determine what type is
  const fileResponse = await fetch(fileData.uri); // returns Response object
  const rawQuestionData = await fileResponse.text();
  return getQuestionObjectsFromFile(fileData.mimeType, rawQuestionData);
};

export const getQuestionObjectsFromFile = (mimeType, rawQuestionData) => {
  let questions = [];

  questions = convertFileToArray(rawQuestionData);
  questions.map((line) => sanitizeAll(line));

  // plain text does not require additional processing (at this time)
  if (MIME_TYPE_CSV.indexOf(mimeType) > -1) {
    questions = parseCsv(questions, 2);
    questions = questions.flat(); // change [[1, 2],[3, 4]]] to [1,2,3,4]
  }
  // else assume text

  return makeQuestionObjects(questions);
};

/**
 * clean input that could have \r\n, remove empty lines
 * @param {*} fileData
 * @returns
 */
const convertFileToArray = (fileData) => {
  let quizData = fileData.split("\n");
  return quizData.map((datum) => datum.trim()).filter((datum) => datum.length > 0);
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
