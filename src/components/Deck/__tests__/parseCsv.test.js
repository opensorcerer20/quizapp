import { parseStringToColumns } from "../parseCsv";

describe("parseStringToColumns", () => {
  it.each([
    { label: "unquoted values", input: "q,a", expected: [["q", "a"]] },
    { label: "fully quoted values", input: '"q","a"', expected: [["q", "a"]] },
    { label: "an empty quoted value", input: '"",a', expected: [["", "a"]] },
    { label: "an empty trailing value", input: "q,", expected: [["q", ""]] },
    { label: "whitespace around values", input: " q , a ", expected: [["q", "a"]] },
    { label: "whitespace inside quotes as trimmed", input: '" q "," a "', expected: [["q", "a"]] },
    { label: "a comma inside quotes", input: '"a, b",c', expected: [["a, b", "c"]] },
    { label: "doubled quotes inside quotes", input: '"say ""hi""",a', expected: [['say "hi"', "a"]] },
    { label: "backslash quotes inside quotes", input: '"say \\"hi\\"",a', expected: [['say "hi"', "a"]] },
    { label: "backslash quotes without quotes", input: 'say \\"hi\\",a', expected: [['say "hi"', "a"]] },
  ])("parses $label", ({ input, expected }) => {
    expect(parseStringToColumns(input, 2)).toEqual(expected);
  });

  it.each([
    { label: "\\n", input: "q1,a1\nq2,a2\n" },
    { label: "\\r\\n", input: "q1,a1\r\nq2,a2\r\n" },
    { label: "blank and whitespace-only lines", input: "\nq1,a1\n\n   \nq2,a2\n\n" },
  ])("splits rows on $label", ({ input }) => {
    expect(parseStringToColumns(input, 2)).toEqual([
      ["q1", "a1"],
      ["q2", "a2"],
    ]);
  });

  it("drops rows with too few columns", () => {
    expect(parseStringToColumns("only\nq,a", 2)).toEqual([["q", "a"]]);
  });

  it("truncates rows with too many columns", () => {
    expect(parseStringToColumns("a,b,c", 2)).toEqual([["a", "b"]]);
  });

  describe("unbalanced quotes", () => {
    it("returns an error row with the line", () => {
      expect(parseStringToColumns('"q,a', 2)).toEqual([["Could not parse csv", '"q,a']]);
    });

    it("cuts the line to 50 characters", () => {
      const line = '"' + "x".repeat(60);

      expect(parseStringToColumns(line, 2)).toEqual([["Could not parse csv", line.substring(0, 50)]]);
    });

    it("only affects the unbalanced row", () => {
      expect(parseStringToColumns('q1,a1\n"q2,a2\nq3,a3', 2)).toEqual([
        ["q1", "a1"],
        ["Could not parse csv", '"q2,a2'],
        ["q3", "a3"],
      ]);
    });
  });

  it.each([
    { label: "an empty string", input: "", columnCount: 2 },
    { label: "null input", input: null, columnCount: 2 },
    { label: "non-string input", input: 123, columnCount: 2 },
    { label: "a missing column count", input: "q,a", columnCount: undefined },
    { label: "a zero column count", input: "q,a", columnCount: 0 },
    { label: "a non-integer column count", input: "q,a", columnCount: 1.5 },
  ])("returns [] for $label", ({ input, columnCount }) => {
    expect(parseStringToColumns(input, columnCount)).toEqual([]);
  });
});
