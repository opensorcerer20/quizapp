import {MAX_CHAR_LIMIT} from "./constants";

export const getRandomInt = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const delay = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const formatCardText = (text) => {
    text = text.trim();
    if (text.length === 0) {
        return "";
    }
    const maxLimit = MAX_CHAR_LIMIT;
    if (text.length > maxLimit) {
        text = text.slice(0, maxLimit) + "...";
    }

    const charLimit = 20; // limit per line, seems to work well with "MW" test
    let textPieces = [];
    let failsafe = 0;
    // console.log('text before loop :' + text);
    do {
        if (text.length > charLimit) {
            // get charLimit chars
            let thisPiece = text.substring(0, charLimit);

            // get last break
            let lastSpace = thisPiece.lastIndexOf(" ");
            let lastDash = thisPiece.lastIndexOf("-");
            let lastPos = lastSpace > lastDash ? lastSpace : lastDash;

            // store up to last break or all 20 chars
            if (lastPos > -1 && lastPos <= charLimit - 1) {
                // keep dash
                let substringEnd = lastPos === lastDash ? lastPos + 1 : lastPos;
                textPieces.push(thisPiece.substring(0, substringEnd));
                text = text.substring(substringEnd);
            } else {
                textPieces.push(thisPiece);
                text = text.substring(charLimit);
            }
        } else {
            textPieces.push(text);
            text = "";
        }
        text = text.trim();
        // console.log('text in loop: ' + text);
        failsafe++;
    } while (text.length > 0 && failsafe < 30);

    return textPieces.join("\n");
};
