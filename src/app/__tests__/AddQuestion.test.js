import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { casesForPath } from "../../__fixtures__/fidelityCases";
import { updateDeckQuestionData } from "../../common/fileLib";
import AddQuestion from "../AddQuestion";

jest.mock("expo-router", () => ({
  router: { back: jest.fn(), setParams: jest.fn() },
  useLocalSearchParams: () => ({ deckId: "123456" }),
}));

jest.mock("../../common/fileLib", () => ({
  loadDeckFromStorage: jest.fn(async () => false),
  loadQuestionsFromStorage: jest.fn(async () => ({ id: 123456, questions: [] })),
  updateDeckQuestionData: jest.fn(async () => true),
}));

jest.mock("../../components/Providers/ThemeProvider", () => ({ useTheme: () => ({ theme: "light" }) }));
jest.mock("../../components/Providers/TranslationProvider", () => ({
  useLocale: () => ({ getLocalString: (str) => str }),
}));
jest.mock(
  "../../components/ScreenTemplate",
  () =>
    ({ children }) =>
      children
);
jest.mock("../../components/Deck/DeckTitle", () => () => null);
jest.mock("../../components/ConfirmModal", () => () => null);

describe("AddQuestion fidelity", () => {
  beforeEach(() => {
    updateDeckQuestionData.mockClear();
  });

  it.each(casesForPath("manual"))("$id keeps $input from manual entry", async ({ input, expected }) => {
    render(<AddQuestion />);

    fireEvent.change(screen.getByTestId("question-input"), { target: { value: input } });
    fireEvent.change(screen.getByTestId("answer-input"), { target: { value: input } });
    fireEvent.click(screen.getByTestId("submit"));

    await waitFor(() => expect(updateDeckQuestionData).toHaveBeenCalled());
    const [, savedQuestions] = updateDeckQuestionData.mock.calls[0];
    expect(savedQuestions).toEqual([expect.objectContaining({ q: expected, a: expected })]);
  });
});
