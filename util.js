
export const makeQuestionObject = (question, answer) => {
    return {
      q: question,
      a: answer,
    };
}

const makeQuestionData = (text) => {
    // clean input that could have \r\n
    let quizData = text.split("\n");
    quizData = quizData.map(datum => datum.trim()).filter(datum => datum.length > 0);
  
    // assume even number with question/answer pairs
    if (quizData.length % 2 === 1) {
      // pop odd row off of the end
      quizData.pop();
    }
    
    // make {q,a} object array
    let questions = [];
    for (let i = 0; i < quizData.length; i += 2) {
      questions.push(makeQuestionObject(quizData[i], quizData[i + 1]));
    }
  
    return questions;
}

export const getFileDataTest = async (fileUri) => {
    const text = `question 1
answer 1
question 2
answer 2
`;
    return makeQuestionData(text);
}

export const getFileData = async (fileUri) => {
    // need to determine what type is
    const fileResponse = await fetch(fileUri); // returns Response object

    // (if type == "text/plain") {
    return await getFileDataTxt(fileResponse);
    // }
}

export const getRandomInt = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const getFileDataTxt = async (fileResponse) => {
    let questions = [];
   
    const fileData = await fileResponse.text();

    questions = makeQuestionData(fileData);

    return questions;
}
