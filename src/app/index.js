import ScreenTemplate from "../components/ScreenTemplate";
import { DeckList } from "./DeckList";

export default QuizApp = () => {
  // use to clear memory
  // useEffect(() => {
  //   saveDeckListData([]);
  // }, []);

  // console.log("quizapp state " + JSON.stringify({ deckListData }));

  return (
    <>
      <ScreenTemplate showBack={false}>
        <DeckList />
      </ScreenTemplate>
    </>
  );
};
