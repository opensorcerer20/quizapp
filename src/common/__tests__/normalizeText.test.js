import { fidelityCases } from "../../__fixtures__/fidelityCases";
import { normalizeText } from "../util";

describe("normalizeText", () => {
  it.each(fidelityCases)("$id turns $input into $expected", ({ input, expected }) => {
    expect(normalizeText(input)).toBe(expected);
  });

  it("converts NFD to NFC", () => {
    const nfd = "café";

    expect(nfd).toHaveLength(5);
    expect(normalizeText(nfd)).toBe("café");
  });

  it("trims the ends and keeps inner whitespace and line breaks", () => {
    expect(normalizeText("\t a \n b \r\n")).toBe("a \n b");
  });

  it("returns an empty string for whitespace-only input", () => {
    expect(normalizeText("   \n\t ")).toBe("");
  });
});
