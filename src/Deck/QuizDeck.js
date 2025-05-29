import { MAX_QUESTIONS, MIME_TYPE_CSV } from "../constants";
import { sanitizeAll } from "../util";

export const emptyQuestion = {
  id: null,
  q: null,
  a: null,
};

export const makeQuestionObject = (id, question, answer) => {
  return {
    id: id,
    q: question,
    a: answer,
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

// @deprecated
export const getStaticData = () => {
  // @todo need to separate decks(decklistdata.data) and decklistdata

  const staticDeckListData = [];
  for (let i = 1; i < 50; i++) {
    staticDeckListData.push(
      // makeNewDeck(i, `deck ${i}`, [
      makeNewDeck(i, `deck ${i}`)
      // [
      //     makeQuestionObject(
      //         1,
      //         `deck ${i} question 1`,
      //         `deck ${i} answer 1`
      //     ),
      //     makeQuestionObject(
      //         2,
      //         `deck ${i} question 2`,
      //         `deck ${i} answer 2`
      //     ),
      //     makeQuestionObject(
      //         3,
      //         `deck ${i} question 3`,
      //         `deck ${i} answer 3`
      //     ),
      //     makeQuestionObject(4, "MW".repeat(200), "MW".repeat(200)),
      // ]
    );
  }
  return staticDeckListData;
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
  //if (JSON.stringify(fileResponse) !== '{}') {
  const rawQuestionData = await fileResponse.text();
  return getQuestionObjectsFromFile(fileData.mimeType, rawQuestionData);
  //} else {
  //  throw new Error('Error: no response reading from file');
  //}
};

// @todo integration test
export const getQuestionObjectsFromFile = (mimeType, rawQuestionData) => {
  let questions = [];

  questions = convertFileToArray(rawQuestionData);

  // console.log("questions[0] " + JSON.stringify(questions[0]));
  // console.log("questions 0 type " + JSON.stringify(typeof questions[0]));
  // plain text does not require additional processing (at this time)
  if (MIME_TYPE_CSV.indexOf(mimeType) > -1) {
    questions = makeQuestionDataCsv(questions, 2);
  }
  // else assume text

  // console.log("questions[0] 2 " + JSON.stringify(questions[0]));
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

/*
only handles either zero quotes or all quotes
*/
export const makeQuestionDataCsv = (quizData, expectedCount) => {
  const parsedData = quizData.map((line) => {
    line = sanitizeAll(line);
    if (line.indexOf('"') > -1) {
      // replace escaped quotes (remember this will end up with a string with quotes in it)
      let parsed = line.replaceAll('"""', '""');
      parsed = parsed.replaceAll('\\"', '"');

      // attempt to split on quoted values
      parsed = parsed.split('","').slice(0, expectedCount);

      if (parsed.length !== expectedCount) {
        return ["could not parse csv line", parsed.join(",")];
      } else {
        // remove start/end quotes for each
        parsed[0] = parsed[0].replace(/^"/, "");
        parsed[1] = parsed[1].replace(/"$/, "");

        return parsed;
      }
    }

    // split on plain commas
    return line.split(",").slice(0, expectedCount);
  });

  return parsedData.flat();
};

/**
 * assumes array of lines with alternating question/answer
 *
 * csv is converted to alternating line format via makeQuestionDataCsv
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
      const question = sanitizeAll(questionData[i]);
      const answer = sanitizeAll(questionData[i + 1]);
      questions.push(makeQuestionObject(questions.length + 1, question, answer));
    }
  }

  return questions;
};
