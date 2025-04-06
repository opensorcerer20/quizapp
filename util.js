
export const makeQuestionObject = (question, answer) => {
    return {
      q: question,
      a: answer,
    };
}

/**
 * clean input that could have \r\n
 * @param {*} fileData 
 * @returns 
 */
const convertFileToArray = (fileData) => {
  let quizData = fileData.split("\n");
  return quizData.map(datum => datum.trim()).filter(datum => datum.length > 0);
} 

// @todo unit test
export const makeQuestionDataCsv = (quizData) => {
  const parsedData = quizData.map(line => {
    let parsed = line.split('","');

    if (parsed.length === 2) {
      // remove first/last character which is assumed to be a quotation mark
      parsed[0] = parsed[0].substring(1);
      parsed[1] = parsed[1].substring(0, parsed[1].length - 1);
    } else {
      parsed = line.split(',');
    }

    return parsed;
  });

  return parsedData.flat();
};

/**
 * assumes array of lines with alternating question/answer
 * @param {*} questionData 
 * @returns 
 */
const makeQuestionObjects = (questionData) => {
  // assume even number with question/answer pairs
  if (questionData.length % 2 === 1) {
    // pop odd row off of the end
    questionData.pop();
  }
  
  // make {q,a} object array
  let questions = [];
  for (let i = 0; i < questionData.length; i += 2) {
    questions.push(makeQuestionObject(questionData[i], questionData[i + 1]));
  }

  return questions;
}

//export const getFileDataTest = async (fileUri) => {
//    const text = `question 1
//answer 1
//question 2
//answer 2
//`;
//    return makeQuestionData(text);
//}

export const getFileData = async (fileData) => {
  // need to determine what type is
  const fileResponse = await fetch(fileData.uri); // returns Response object
  const rawQuestionData = await fileResponse.text();
  return getQuestionObjectsFromFile(rawQuestionData);
}

// @todo integration test
export const getQuestionObjectsFromFile = (rawQuestionData) => {
  let questions = [];
  
  const quizData = convertFileToArray(rawQuestionData);

  // plain text does not require additional processing (at this time)
  if (fileData.mimeType === "text/csv") {
    questions = makeQuestionDataCsv(quizData);
  }

  return makeQuestionObjects(questions);
}

export const getRandomInt = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
