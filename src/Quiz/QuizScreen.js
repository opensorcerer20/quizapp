import { ReviewScreen } from "./ReviewScreen";

/*
later there will be a quiz screen etc
*/

const QuizScreen = ({ currentDeck, currentDeckData }) => {
    return (
        <ReviewScreen
            currentDeck={currentDeck}
            currentDeckData={currentDeckData}
        />
    );
};

export default QuizScreen;
