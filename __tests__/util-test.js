import { formatCardText } from "../util";

describe("formatCardText", () => {
  it("returns the original text when no words exceed the char limit", () => {
    const input = "short words only";
    const result = formatCardText(input);
    expect(result).toBe("short words only");
  });

  it("splits a word of 21 chars", () => {
    const input = "abcdefghijklmnopqrstu";
    const result = formatCardText(input);
    expect(result).toBe("abcdefghijklmnopqrst\nu");
  });

  it("splits words over the char limit into multiple lines", () => {
    const input = "thisisaquitelongwordthatexceeds20chars";
    const result = formatCardText(input);
    expect(result).toBe("thisisaquitelongword\nthatexceeds20chars");
  });

  it("splits long hyphenated words correctly and keeps dashes", () => {
    const input = "thisis-a-verylonghyphenatedword-example";
    const result = formatCardText(input);
    expect(result).toBe("thisis-a-\nverylonghyphenatedwo\nrd-example");
  });

  it("handles mixed short and long words with hyphens and spaces", () => {
    const input = "simple-word and supercalifragilisticexpialidocious-part";
    const result = formatCardText(input);
    expect(result).toBe(
      "simple-word and\nsupercalifragilistic\nexpialidocious-part"
    );
  });

  it("handles multiple dashes in a word", () => {
    const input = "multi-part-word-here";
    const result = formatCardText(input);
    expect(result).toBe("multi-part-word-here");
  });

  it("handles input with only spaces", () => {
    const input = "   ";
    const result = formatCardText(input);
    expect(result).toBe("");
  });

  it("handles empty string input", () => {
    const input = "";
    const result = formatCardText(input);
    expect(result).toBe("");
  });

  it("splits long dash-free word and appends remaining chars properly", () => {
    const input = "averyveryverylongword";
    const result = formatCardText(input);
    expect(result).toBe("averyveryverylongwor\nd");
  });
});
