// Fidelity cases from docs/text-input-test-cases.md: input is kept as typed, apart from trimming and NFC normalization
const ALL = ["text", "csv", "manual"];

export const fidelityCases = [
  { id: "F-01", input: "<b>hola</b>", paths: ALL },
  { id: "F-02", input: "<script>alert(1)</script>", paths: ALL },
  { id: "F-02", input: "<img src=x onerror=alert(1)>", paths: ALL },
  { id: "F-03", input: "x < 5 && y > 2", paths: ALL },
  { id: "F-04", input: "Tom &amp; Jerry", paths: ALL },
  // csv uses quotes as syntax, so quote handling there is a parsing concern
  { id: "F-05", input: '"quoted"', paths: ["text", "manual"] },
  { id: "F-05", input: "it's", paths: ["text", "manual"] },
  { id: "F-05", input: "`code`", paths: ["text", "manual"] },
  { id: "F-06", input: "café", paths: ALL },
  { id: "F-06", input: "naïve", paths: ALL },
  { id: "F-06", input: "日本語", paths: ALL },
  { id: "F-06", input: "こんにちは", paths: ALL },
  { id: "F-06", input: "مرحبا", paths: ALL },
  { id: "F-07", input: "👩‍💻", paths: ALL },
  { id: "F-07", input: "🇯🇵", paths: ALL },
  { id: "F-07", input: "👍🏽", paths: ALL },
  { id: "F-08", input: "café", expected: "café", paths: ALL },
  { id: "F-09", input: "=SUM(A1:A2)", paths: ALL },
  { id: "F-09", input: "+1", paths: ALL },
  { id: "F-09", input: "-1", paths: ALL },
  { id: "F-09", input: "@user", paths: ALL },
  { id: "F-10", input: "__proto__", paths: ALL },
  { id: "F-10", input: "constructor", paths: ALL },
  { id: "F-10", input: "toString", paths: ALL },
  { id: "F-11", input: "  a    b  ", expected: "a    b", paths: ALL },
].map((c) => ({ expected: c.input, ...c }));

export const casesForPath = (path) => fidelityCases.filter((c) => c.paths.includes(path));
