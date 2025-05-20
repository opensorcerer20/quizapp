import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeQuestionObject } from "./Deck/QuizDeck";
import { MAX_QUESTIONS } from "./constants";

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

    // plain text does not require additional processing (at this time)
    if (mimeType === "text/csv") {
        questions = makeQuestionDataCsv(questions);
    }

    return makeQuestionObjects(questions);
};

/**
 * clean input that could have \r\n, remove empty lines
 * @param {*} fileData
 * @returns
 */
const convertFileToArray = (fileData) => {
    let quizData = fileData.split("\n");
    return quizData
        .map((datum) => datum.trim())
        .filter((datum) => datum.length > 0);
};

export const makeQuestionDataCsv = (quizData) => {
    const parsedData = quizData.map((line) => {
        let parsed = line.split('","');

        if (parsed.length === 2) {
            // remove first/last character which is assumed to be a quotation mark
            parsed[0] = parsed[0].substring(1);
            parsed[1] = parsed[1].substring(0, parsed[1].length - 1);

            // remove remaining escaped quotes
            parsed[0] = parsed[0].replace(/\\"|""/g, '"');
            parsed[1] = parsed[1].replace(/\\"|""/g, '"');
        } else {
            parsed = line.split(",");
        }

        return parsed;
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
const makeQuestionObjects = (questionData) => {
    // assume even number with question/answer pairs
    if (questionData.length % 2 === 1) {
        // pop odd row off of the end
        questionData.pop();
    }

    // make {q,a} object array
    let questions = [];
    for (let i = 0; i < questionData.length; i += 2) {
        if (questions.length <= MAX_QUESTIONS) {
            questions.push(
                makeQuestionObject(
                    questions.length + 1,
                    questionData[i],
                    questionData[i + 1]
                )
            );
        }
    }

    return questions;
};

export const loadStorageData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (e) {
        console.log(
            `error loading data with key ${key}, error keys ` +
                JSON.stringify(Object.keys(e))
        );
    }
};

export const saveStorageData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.log(
            `error saving data with key ${key}, error keys ` +
                JSON.stringify(Object.keys(error))
        );
    }
};

export const removeStorageData = async (key) => {
    try {
        const value = await AsyncStorage.removeItem(key);
        return true;
    } catch (e) {
        console.log(
            `error loading data with key ${key}, error keys ` +
                JSON.stringify(Object.keys(e))
        );
    }
};
