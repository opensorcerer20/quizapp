import { DeckList } from "./DeckList";
import Toast from 'react-native-toast-message';

const QuizApp = () => {
  // use to clear memory
  // useEffect(() => {
  //   saveDeckListData([]);
  // }, []);

  // console.log("quizapp state " + JSON.stringify({ deckListData }));

  return (
    <>
      <DeckList />
      <Toast />
    </>
  );
};

export default QuizApp;
