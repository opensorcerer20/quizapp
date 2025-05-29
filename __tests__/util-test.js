import { formatCardText } from "../src/util";

describe("formatCardText", () => {
  it("returns the original text when no words exceed the char limit", () => {
    const input = "short words only";
    const result = formatCardText(input);
    expect(result).toBe("short words\nonly");
  });

  it("splits a word of 21 chars", () => {
    const input = "abcdefghijklmnopqrstu";
    const result = formatCardText(input);
    expect(result).toBe("abcdefghijklm\nnopqrstu");
  });

  it("splits words over the char limit into multiple lines", () => {
    const input = "thisisaquitelongwordthatexceeds20chars";
    const result = formatCardText(input);
    expect(result).toBe("thisisaquitel\nongwordthatex\nceeds20chars");
  });

  it("splits long hyphenated words correctly and keeps dashes", () => {
    const input = "thisis-a-verylonghyphenatedword-example";
    const result = formatCardText(input);
    expect(result).toBe("thisis-a-\nverylonghyphe\nnatedword-\nexample");
  });

  it("handles mixed short and long words with hyphens and spaces", () => {
    const input = "simple-word and supercalifragilisticexpialidocious-part";
    const result = formatCardText(input);
    expect(result).toBe("simple-word\nand\nsupercalifrag\nilisticexpial\nidocious-part");
  });

  it("handles multiple dashes in a word", () => {
    const input = "multi-part-word-here";
    const result = formatCardText(input);
    expect(result).toBe("multi-part-\nword-here");
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
    expect(result).toBe("averyveryvery\nlongword");
  });

  // @todo test different line maxes
});
