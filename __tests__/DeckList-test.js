import { render } from "@testing-library/react-native";

import DeckList from "../DeckList";

describe("<DeckList />", () => {
  it("renders empty list correctly", () => {
    const { getByText } = render(
      <DeckList data={[]} onPress={() => {}} onDelete={() => {}} />
    );

    getByText("No decks in memory, please add a deck");
  });
});
