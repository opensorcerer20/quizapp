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
    data: [],
};

export const makeNewDeck = (id, name) => {
    let deck = JSON.parse(JSON.stringify(emptyDeck));
    deck.id = id;
    deck.name = name;
    return deck;
};

export const addQuestionToDeck = (deck, id, question, answer) => {
    let newQ = makeQuestionObject(id, question, answer);
    return deck.data.push(newQ);
};
