import { parseRawCsv } from "../src/components/Deck/parseCsv";

describe("parseRawCsv", () => {
  it("parses lines with no quotes", () => {
    const rawCsv = "sí,yes";
    expect(parseRawCsv(rawCsv, 2)).toEqual([["sí", "yes"]]);
  });

  it("parses lines with no quotes and 3 items to 2 items", () => {
    const rawCsv = "sí,yes,extra";
    expect(parseRawCsv(rawCsv, 2)).toEqual([["sí", "yes"]]);
  });

  it("parses lines with full quotes", () => {
    const rawCsv = '"sí","yes"';
    expect(parseRawCsv(rawCsv, 2)).toEqual([["sí", "yes"]]);
  });

  it("parses lines with full quotes and 3 items to 2 items", () => {
    const rawCsv = '"sí","yes","extra"';
    expect(parseRawCsv(rawCsv, 2)).toEqual([["sí", "yes"]]);
  });

  it("parses lines with partial quotes", () => {
    const rawCsv = '"sí",yes';
    expect(parseRawCsv(rawCsv, 2)).toEqual([["sí", "yes"]]);
  });

  it("parses lines with partial quotes 2", () => {
    const rawCsv = 'sí,"yes"';
    expect(parseRawCsv(rawCsv, 2)).toEqual([["sí", "yes"]]);
  });

  it("handles improperly quoted lines gracefully", () => {
    const rawCsv = '"Badly quoted line,Not included';
    expect(parseRawCsv(rawCsv, 2)).toEqual([["Could not parse csv", "Badly quoted line,Not included"]]);
  });

  // the comma makes it 2 columns, which passes column count
  it("handles improperly quoted lines gracefully 2", () => {
    const rawCsv = 'Badly quoted line",Still included';
    expect(parseRawCsv(rawCsv, 2)).toEqual([['Badly quoted line"', "Still included"]]);
  });

  it("handles improperly quoted lines gracefully 3", () => {
    const rawCsv = 'Badly quot"ed line,Still included';
    expect(parseRawCsv(rawCsv, 2)).toEqual([['Badly quot"ed line', "Still included"]]);
  });

  it("parses lines with full quotes and commas", () => {
    const rawCsv = '"sí,","yes"';
    expect(parseRawCsv(rawCsv, 2)).toEqual([["sí,", "yes"]]);
  });

  it("parses lines with partial quotes and commas", () => {
    const rawCsv = '"sí,",yes';
    expect(parseRawCsv(rawCsv, 2)).toEqual([["sí,", "yes"]]);
  });

  it("parses lines with partial quotes and commas 2", () => {
    const rawCsv = 'sí,",yes"';
    expect(parseRawCsv(rawCsv, 2)).toEqual([["sí", ",yes"]]);
  });

  it("parses lines with triple escaped quotes", () => {
    const rawCsv = '"""sí""","""yes"""';
    expect(parseRawCsv(rawCsv, 2)).toEqual([['"sí"', '"yes"']]);
  });

  it("parses lines with triple escaped quotes and commas", () => {
    const rawCsv = '"""sí,""","""yes"""';
    expect(parseRawCsv(rawCsv, 2)).toEqual([['"sí,"', '"yes"']]);
  });

  // it("parses lines with slash escaped quotes", () => {
  //   const rawCsv = '"\\"sí\\"","\\"yes\\""';
  //   expect(parseRawCsv(rawCsv, 2)).toEqual([['"sí"', '"yes"']]);
  // });

  // it("parses lines with slash escaped quotes and commas", () => {
  //   const rawCsv = '"\\"sí,\\"","\\"yes\\""';
  //   expect(parseRawCsv(rawCsv, 2)).toEqual([['"sí,"', '"yes"']]);
  // });

  // // test 3 items
  it("parses lines with no quotes and 3 expected cols", () => {
    const rawCsv = "sí,yes,more";
    expect(parseRawCsv(rawCsv, 3)).toEqual([["sí", "yes", "more"]]);
  });

  it("parses lines with full quotes and 3 expected cols", () => {
    const rawCsv = '"sí","yes","more"';
    expect(parseRawCsv(rawCsv, 3)).toEqual([["sí", "yes", "more"]]);
  });

  // // test 2 lines
  it("parses two lines with no quotes and 3 expected cols", () => {
    const rawCsv = "sí,yes,more\nfour,five,six";
    expect(parseRawCsv(rawCsv, 3)).toEqual([
      ["sí", "yes", "more"],
      ["four", "five", "six"],
    ]);
  });

  it("parses two lines with full quotes and 3 expected cols", () => {
    const rawCsv = '"sí","yes","more"' + "\n" + '"four","five","six"';
    expect(parseRawCsv(rawCsv, 3)).toEqual([
      ["sí", "yes", "more"],
      ["four", "five", "six"],
    ]);
  });

  // @todo more comma tests?

  // @todo test trim

  // @todo test safe parse
});
