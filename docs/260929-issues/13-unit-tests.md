title: Add unit tests for parsing, formatting, and storage logic
labels: testing
section: Testing and tooling
---
### Problem

The project has end-to-end tests only. The most testable code has no unit tests: the CSV parser, text formatting, question building, and the grab-bag shuffle.

### Fix

Add Jest with `jest-expo`, which is the standard setup for Expo projects, and a `test:unit` script. Rename the existing Playwright script to `test:e2e`.

Priority targets:

- `parseStringToColumns` in `parseCsv.js`: unquoted, fully quoted, escaped quotes (`""` and `\"`), commas inside quotes, unbalanced quotes, blank lines, `\r\n` line endings
- `getQuestionObjectsFromRawData` and `makeQuestionObjects` in `QuizDeck.js`: odd line counts, the `MAX_QUESTIONS` limit, sanitization
- `formatCardText` and `getFontSize` in `util.js`: boundaries at each character limit
- `randomizeQBag`: returns the same items and does not mutate its input
- `fileLib.js`: round-trip save and load, and behavior when storage throws (use a mocked `localStorage`)

### Done when

- [ ] `npm run test:unit` runs and passes
- [ ] The parser and `QuizDeck.js` helpers have above 90% line coverage
- [ ] README documents both `test:unit` and `test:e2e`

### Changelog (changes after the issue was created)

- Jest, `jest-expo/web` preset, `test:unit` script, and README unit test section already existed from issues 09–12
- Coverage target scoped to the named `QuizDeck.js` helpers; `importNewDeck`, `getFileData`, `makeNewDeck`, `makeNewDeckData` untested
- `test:coverage` script added (report only, no enforced threshold)
- Code changes outside the original scope, authorized during review:
  - `formatCardText`: appends a `...` line when the 30-line failsafe drops text
  - `makeQuestionObjects`: no longer mutates its input; skips a trailing unpaired line
  - `loadDeckFromStorage`: returns `false` instead of `[]` when the deck id is not in the list, so `loadDeckData` returns `[null, []]` for that case
  - `AddQuestion.js`: simplified to `loadDeckFromStorage(deckId) || null`
- Current behavior recorded in tests, not changed: unparseable csv rows become a "Could not parse csv" question; whitespace inside csv quotes is trimmed
