import { MAX_QUESTIONS } from "../constants";

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
    // if (Array.isArray(questions)) {
    //     questions.map((questionObj) => {
    //         // validation in lieu of strict typing
    //         if (
    //             questionObj.id &&
    //             questionObj.q &&
    //             questionObj.a &&
    //             deck.data.length <= MAX_QUESTIONS
    //         ) {
    //             deck.data.push(questionObj);
    //         }
    //     });
    // }
    return deck;
};

export const makeNewDeckData = (id, questions) => {
    if (typeof id === 'number' && Array.isArray(questions) && questions.length > 0) {
        return {
            id,
            questions,
        };
    }

    return false;
}

// export const addQuestionToDeck = (deck, id, question, answer) => {
//     let newQ = makeQuestionObject(id, question, answer);
//     return deck.data.push(newQ);
// };

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
