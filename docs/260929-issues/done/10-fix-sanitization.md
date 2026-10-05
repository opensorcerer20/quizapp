title: Make input sanitization actually apply to imported decks
labels: bug, security
section: Correctness fixes
---
### Problem

- In `src/components/Deck/QuizDeck.js`, `getQuestionObjectsFromRawData` runs `questions.map((line) => sanitizeAll(line));` and discards the result, so text imports are never sanitized.
- The CSV path (`parseStringToColumns` in `parseCsv.js`) never calls `sanitizeAll`.
- Cards added through the in-app form should be checked too.

React Native `Text` does not render HTML, so the immediate risk is low. But the roadmap says input is sanitized.

### Fix

- Sanitize once, in one place: in `makeQuestionObjects`, apply `sanitizeAll` to each question and answer. That covers text, CSV, and manual entry.
- Remove the dead `.map` call.

### Done when

- [ ] Text, CSV, and manual entry all produce sanitized questions and answers
- [ ] Unit tests cover an input such as `<b>hola</b>` for each path
