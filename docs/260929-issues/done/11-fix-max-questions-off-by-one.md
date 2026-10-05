title: Fix off-by-one in the MAX_QUESTIONS limit
labels: bug
section: Correctness fixes
---
### Problem

`makeQuestionObjects` in `src/components/Deck/QuizDeck.js` checks `if (questions.length <= MAX_QUESTIONS)` before pushing a question. With `MAX_QUESTIONS = 50`, it allows 51 cards.

### Fix

Change the check to `questions.length < MAX_QUESTIONS`, or build the full list and use `.slice(0, MAX_QUESTIONS)`.

### Done when

- [ ] Importing a file with 60 question/answer pairs produces exactly 50 cards
- [ ] A unit test covers the 49, 50, and 51 cases
