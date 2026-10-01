import { render } from "@testing-library/react";

import { fidelityCases } from "../../../__fixtures__/fidelityCases";
import DeckScreenItem from "../DeckScreenItem";

jest.mock("@expo/vector-icons/MaterialCommunityIcons", () => () => null, { virtual: true });
jest.mock("../../ConfirmModal", () => () => null);
jest.mock("../../SwipeableListItem", () => ({
  __esModule: true,
  default: ({ children }) => children,
  makeButtonSettings: () => null,
}));
jest.mock("../../Providers/TranslationProvider", () => ({
  useLocale: () => ({ getLocalString: (str) => str }),
}));

const scheme = { txt: {}, bgDisabled: {}, bgPrimary: {}, bgAccent: {} };

describe("DeckScreenItem fidelity", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // stored values are already normalized, so render what the import paths produce
  it.each(fidelityCases)("$id displays $expected as literal text", ({ expected }) => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const item = { id: 1, q: expected, a: expected, disabled: false };

    const { container } = render(<DeckScreenItem item={item} scheme={scheme} />);

    expect(container.textContent).toContain(`Q: ${expected}`);
    expect(container.textContent).toContain(`A: ${expected}`);
    expect(container.querySelector("b, script, img")).toBeNull();
    expect(alertSpy).not.toHaveBeenCalled();
  });
});
