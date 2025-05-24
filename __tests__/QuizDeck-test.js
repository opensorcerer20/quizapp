import { makeQuestionDataCsv } from "../src/Deck/QuizDeck";

describe("makeQuestionDataCsv", () => {
    it("parses lines with no quotes", () => {
        const questions = ["sí,yes"];
        expect(makeQuestionDataCsv(questions)).toEqual(["sí", "yes"]);
    });
    it("parses lines with no quotes and 3 items to 2 items", () => {
        const questions = ["sí,yes,extra"];
        expect(makeQuestionDataCsv(questions)).toEqual(["sí", "yes"]);
    });

    it("parses lines with full quotes", () => {
        const questions = ['"sí","yes"'];
        expect(makeQuestionDataCsv(questions)).toEqual(["sí", "yes"]);
    });

    it("parses lines with full quotes and 3 items to 2 items", () => {
        const questions = ['"sí","yes"'];
        expect(makeQuestionDataCsv(questions)).toEqual(["sí", "yes"]);
    });

    it("parses lines with partial quotes", () => {
        const questions = ['"sí",yes'];
        expect(makeQuestionDataCsv(questions)).toEqual(["sí", "yes"]);
    });

    it("parses lines with triple escaped quotes", () => {
        const questions = ['"""sí""",yes'];
        expect(makeQuestionDataCsv(questions)).toEqual(['"sí"', "yes"]);
    });

    it("parses lines with slash escaped quotes", () => {
        const questions = ['"\\"sí"\\",yes'];
        expect(makeQuestionDataCsv(questions)).toEqual(['"sí"', "yes"]);
    });

    it("handles improperly quoted lines gracefully", () => {
        const questions = ['"Badly quoted line,Still included'];
        expect(makeQuestionDataCsv(questions)).toEqual([
            "Badly quoted line",
            "Still included",
        ]);
    });

    it("handles improperly quoted lines gracefully 2", () => {
        const questions = ['Badly quoted line",Still included'];
        expect(makeQuestionDataCsv(questions)).toEqual([
            "Badly quoted line",
            "Still included",
        ]);
    });

    it("handles improperly quoted lines gracefully 2", () => {
        const questions = ['Badly quot"ed line,Still included'];
        expect(makeQuestionDataCsv(questions)).toEqual([
            'Badly quot"ed line',
            "Still included",
        ]);
    });
});
