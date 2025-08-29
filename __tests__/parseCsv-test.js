import { parseStringToColumns } from "../src/components/Deck/parseCsv";

describe("parseStringToColumns", () => {
  it.each(["sí,yes", "sí,yes,extra", '"sí","yes"', '"sí","yes","extra"', '"sí",yes', 'sí,"yes"'])(
    "parses line %s to get expected 2 values",
    (rawCsv) => {
      expect(parseStringToColumns(rawCsv, 2)).toEqual([["sí", "yes"]]);
    }
  );

  it.each(['"Badly quoted line,Not included', 'Badly quoted line,Not included"', 'Badly quo"ted line,Not included'])(
    "rejects %s as could not parse",
    (rawCsv) => {
      expect(parseStringToColumns(rawCsv, 2)).toEqual([["Could not parse csv", rawCsv]]);
    }
  );

  it("parses lines with full quotes and commas", () => {
    const rawCsv = '"sí,","yes"';
    expect(parseStringToColumns(rawCsv, 2)).toEqual([["sí,", "yes"]]);
  });

  it("parses lines with partial quotes and commas", () => {
    const rawCsv = '"sí,",yes';
    expect(parseStringToColumns(rawCsv, 2)).toEqual([["sí,", "yes"]]);
  });

  it("parses lines with partial quotes and commas 2", () => {
    const rawCsv = 'sí,",yes"';
    expect(parseStringToColumns(rawCsv, 2)).toEqual([["sí", ",yes"]]);
  });

  it("parses lines with double escaped quotes", () => {
    const rawCsv = '"""sí""","""yes"""';
    expect(parseStringToColumns(rawCsv, 2)).toEqual([['"sí"', '"yes"']]);
  });

  it("parses lines with double escaped quotes and commas", () => {
    const rawCsv = '"""sí,""","""yes"""';
    expect(parseStringToColumns(rawCsv, 2)).toEqual([['"sí,"', '"yes"']]);
  });

  it("parses lines with double escaped quotes and commas 2", () => {
    const rawCsv = '"Value with ""double quotes"", and a comma",Another Value';
    expect(parseStringToColumns(rawCsv, 2)).toEqual([['Value with "double quotes", and a comma', "Another Value"]]);
  });

  it("parses lines with slash escaped quotes", () => {
    const rawCsv = '"\\"sí\\"","\\"yes\\""';
    expect(parseStringToColumns(rawCsv, 2)).toEqual([['"sí"', '"yes"']]);
  });

  it("parses lines with slash escaped quotes and commas", () => {
    const rawCsv = '"\\"sí,\\"","\\"yes\\""';
    expect(parseStringToColumns(rawCsv, 2)).toEqual([['"sí,"', '"yes"']]);
  });

  // // test 3 items
  it("parses lines with no quotes and 3 expected cols", () => {
    const rawCsv = "sí,yes,more";
    expect(parseStringToColumns(rawCsv, 3)).toEqual([["sí", "yes", "more"]]);
  });

  it("parses lines with full quotes and 3 expected cols", () => {
    const rawCsv = '"sí","yes","more"';
    expect(parseStringToColumns(rawCsv, 3)).toEqual([["sí", "yes", "more"]]);
  });

  // // test 2 lines
  it("parses two lines with no quotes and 3 expected cols", () => {
    const rawCsv = "sí,yes,more\nfour,five,six";
    expect(parseStringToColumns(rawCsv, 3)).toEqual([
      ["sí", "yes", "more"],
      ["four", "five", "six"],
    ]);
  });

  it("parses two lines with full quotes and 3 expected cols", () => {
    const rawCsv = '"sí","yes","more"' + "\n" + '"four","five","six"';
    expect(parseStringToColumns(rawCsv, 3)).toEqual([
      ["sí", "yes", "more"],
      ["four", "five", "six"],
    ]);
  });

  // @todo more comma tests?

  // @todo test trim

  // @todo test safe parse
});
