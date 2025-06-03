import { parseCsv } from "../src/components/Deck/parseCsv";

describe("parseCsv", () => {
  it("parses lines with no quotes", () => {
    const questions = ["sí,yes"];
    expect(parseCsv(questions, 2)).toEqual([["sí", "yes"]]);
  });

  it("parses lines with no quotes and 3 items to 2 items", () => {
    const questions = ["sí,yes,extra"];
    expect(parseCsv(questions, 2)).toEqual([["sí", "yes"]]);
  });

  it("parses lines with full quotes", () => {
    const questions = ['"sí","yes"'];
    expect(parseCsv(questions, 2)).toEqual([["sí", "yes"]]);
  });

  it("parses lines with full quotes and 3 items to 2 items", () => {
    const questions = ['"sí","yes","extra"'];
    expect(parseCsv(questions, 2)).toEqual([["sí", "yes"]]);
  });

  // it("parses lines with partial quotes", () => {
  //     const questions = ['"sí",yes'];
  //     expect(parseCsv(questions, 2)).toEqual(["sí", "yes"]);
  // });

  // it("parses lines with partial quotes 2", () => {
  //     const questions = ['sí,"yes"'];
  //     expect(parseCsv(questions, 2)).toEqual(["sí", "yes"]);
  // });

  it("handles improperly quoted lines gracefully", () => {
    const questions = ['"Badly quoted line,Still included'];
    expect(parseCsv(questions, 2)).toEqual([["could not parse csv line", '"Badly quoted line,Still included']]);
  });

  it("handles improperly quoted lines gracefully 2", () => {
    const questions = ['Badly quoted line",Still included'];
    expect(parseCsv(questions, 2)).toEqual([["could not parse csv line", 'Badly quoted line",Still included']]);
  });

  it("handles improperly quoted lines gracefully 3", () => {
    const questions = ['Badly quot"ed line,Still included'];
    expect(parseCsv(questions, 2)).toEqual([["could not parse csv line", 'Badly quot"ed line,Still included']]);
  });

  it("parses lines with full quotes and commas", () => {
    const questions = ['"sí,","yes"'];
    expect(parseCsv(questions, 2)).toEqual([["sí,", "yes"]]);
  });

  // it("parses lines with partial quotes and commas", () => {
  //     const questions = ['"sí,",yes'];
  //     expect(parseCsv(questions, 2)).toEqual(["sí,", "yes"]);
  // });

  // it("parses lines with partial quotes and commas 2", () => {
  //     const questions = ['sí,",yes"'];
  //     expect(parseCsv(questions, 2)).toEqual(["sí", ",yes"]);
  // });

  it("parses lines with triple escaped quotes", () => {
    const questions = ['"""sí""","""yes"""'];
    expect(parseCsv(questions, 2)).toEqual([['"sí"', '"yes"']]);
  });

  it("parses lines with triple escaped quotes and commas", () => {
    const questions = ['"""sí,""","""yes"""'];
    expect(parseCsv(questions, 2)).toEqual([['"sí,"', '"yes"']]);
  });

  it("parses lines with slash escaped quotes", () => {
    const questions = ['"\\"sí\\"","\\"yes\\""'];
    expect(parseCsv(questions, 2)).toEqual([['"sí"', '"yes"']]);
  });

  it("parses lines with slash escaped quotes and commas", () => {
    const questions = ['"\\"sí,\\"","\\"yes\\""'];
    expect(parseCsv(questions, 2)).toEqual([['"sí,"', '"yes"']]);
  });

  // this now happens OUTSIDE this method
  // it("handles html", () => {
  //   const questions = ["<b>sí</b>,yes"];
  //   expect(parseCsv(questions, 2)).toEqual(["sí", "yes"]);
  // });

  // test 3 items
  it("parses lines with no quotes and 3 expected cols", () => {
    const questions = ["sí,yes,more"];
    expect(parseCsv(questions, 3)).toEqual([["sí", "yes", "more"]]);
  });

  it("parses lines with full quotes and 3 expected cols", () => {
    const questions = ['"sí","yes","more"'];
    expect(parseCsv(questions, 3)).toEqual([["sí", "yes", "more"]]);
  });

  // test 2 lines
  it("parses two lines with no quotes and 3 expected cols", () => {
    const questions = ["sí,yes,more", "four,five,six"];
    expect(parseCsv(questions, 3)).toEqual([
      ["sí", "yes", "more"],
      ["four", "five", "six"],
    ]);
  });

  it("parses two lines with full quotes and 3 expected cols", () => {
    const questions = ['"sí","yes","more"', '"four","five","six"'];
    expect(parseCsv(questions, 3)).toEqual([
      ["sí", "yes", "more"],
      ["four", "five", "six"],
    ]);
  });
});
