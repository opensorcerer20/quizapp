import { MAX_CHAR_LIMIT, MAX_CHAR_LIMIT_L, MAX_CHAR_LIMIT_XL, MAX_CHAR_LIMIT_XXL } from "../constants";
import { formatCardText, getFontSize } from "../util";

describe("getFontSize", () => {
  it.each([
    [0, "xxl"],
    [MAX_CHAR_LIMIT_XXL, "xxl"],
    [MAX_CHAR_LIMIT_XXL + 1, "xl"],
    [MAX_CHAR_LIMIT_XL, "xl"],
    [MAX_CHAR_LIMIT_XL + 1, "l"],
    [MAX_CHAR_LIMIT_L, "l"],
    [MAX_CHAR_LIMIT_L + 1, ""],
  ])("length %i is size '%s'", (length, expected) => {
    expect(getFontSize(length)).toBe(expected);
  });
});

describe("formatCardText", () => {
  it.each([
    { label: "an empty string", input: "" },
    { label: "whitespace only", input: "  \n\t " },
  ])("returns an empty string for $label", ({ input }) => {
    expect(formatCardText(input)).toBe("");
  });

  it("trims the ends", () => {
    expect(formatCardText("  some text  ")).toBe("some text");
  });

  describe("MAX_CHAR_LIMIT truncation", () => {
    it("keeps text at the limit", () => {
      const text = "x".repeat(MAX_CHAR_LIMIT);

      expect(formatCardText(text)).toBe(text);
    });

    it("cuts text over the limit and adds an ellipsis", () => {
      const text = "x".repeat(MAX_CHAR_LIMIT + 1);

      expect(formatCardText(text)).toBe("x".repeat(MAX_CHAR_LIMIT) + "...");
    });
  });

  describe("line wrapping with lineLimitOverride", () => {
    it.each([
      { label: "does not wrap text at the limit", input: "hello worl", expected: "hello worl" },
      { label: "breaks at the last space", input: "hello world foo", expected: "hello\nworld foo" },
      { label: "breaks after the last dash and keeps it", input: "well-known fact", expected: "well-\nknown fact" },
      {
        label: "hard-breaks a word with no break point",
        input: "abcdefghijklmnopqrstu",
        expected: "abcdefghij\nklmnopqrst\nu",
      },
    ])("$label", ({ input, expected }) => {
      expect(formatCardText(input, 10)).toBe(expected);
    });

    it("does not wrap without an override", () => {
      const text = "word ".repeat(40).trim();

      expect(formatCardText(text)).toBe(text);
    });

    it("keeps exactly 30 lines without an ellipsis", () => {
      expect(formatCardText("x".repeat(30), 1)).toBe(Array(30).fill("x").join("\n"));
    });

    it("stops after 30 lines and adds an ellipsis line when text remains", () => {
      expect(formatCardText("x".repeat(31), 1)).toBe([...Array(30).fill("x"), "..."].join("\n"));
    });
  });
});
