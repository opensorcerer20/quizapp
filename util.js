
export const makeQuestionObject = (question, answer) => {
    return {
      q: question,
      a: answer,
    };
}

export const getRandomInt = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const delay = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
