
const makeQuestionObject = (question, answer) => {
    return {
      q: question,
      a: answer,
    };
}

const makeQuestionData = (text) => {
    // clean input that could have \r\n
    var quizData = text.split("\n");
    //console.log('quizdata 1 ' + JSON.stringify(quizData));
    quizData = quizData.map(datum => datum.trim()).filter(datum => datum.length > 0);
  
    // assume even number with question/answer pairs
    if (quizData.length % 2 === 1) {
      quizData.pop();
    }
    
    // make {q,a} object array
    var questions = [];
    for (var i = 0; i < quizData.length; i += 2) {
      questions.push(makeQuestionObject(quizData[i], quizData[i + 1]));
    }
  
    return questions;
}

export const getFileDataTest = async (fileUri) => {
    //console.log('test getfiledata');
    const text = `question 1
answer 1
question 2
answer 2
`;
    return makeQuestionData(text);
}


export const getFileData = async (fileUri) => {
    var questions = [];
    
    await fetch(
      fileUri,
      {
        headers : {
          'Content-Type': 'text/plain',
          'Accept': 'text/plain'
        }
      }
    )
      .then((response) => {
        return response.text();
      })
      .then(function(text) {
        questions = makeQuestionData(text);
      });
      //console.log('questions ' + JSON.stringify(questions));
    return questions;
}
