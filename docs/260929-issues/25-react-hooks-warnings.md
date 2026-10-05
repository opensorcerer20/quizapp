title: Fix remaining react-hooks lint warnings
labels: bug, code-quality
section: Correctness fixes
---
### Problem

`npm run lint` reports 11 `react-hooks` warnings. Seven come from React Compiler rules in `eslint-plugin-react-hooks` v7 that were downgraded from error to warn in issue 14 so linting could pass without behavior changes. The other four are missing effect dependencies.

Downgraded rules (`set-state-in-effect`, `static-components`, `refs`):

- `src/app/DeckList.js:139` and `:145`: `set-state-in-effect`
- `src/app/DeckScreen.js:110`: `set-state-in-effect`
- `src/app/QuizScreen.js:48`: `set-state-in-effect`
- `src/app/Tutorial.js:35`: `refs` (`useRef(...).current` read during render for `onViewableItemsChanged`)
- `src/components/Deck/FlipCard.js:111` and `:126`: `static-components` (`CardHeader` is declared inside the component)

Missing dependencies (`exhaustive-deps`):

- `src/app/DeckList.js:141`: `importDeck`
- `src/app/DeckScreen.js:100` and `:113`: `loadDeckDataFromStorage`
- `src/components/Quiz/ReviewScreen.js:109`: `currentDeck`, `currentDeckQuestionData`, `resetQuestionBag`

### Fix

- Hoist `CardHeader` out of `FlipCard` and pass what it needs as props.
- Replace synchronous `setState` in effects with derived state, event handlers, or state set during render where appropriate.
- Use `useCallback` (or move functions inside the effect) so dependency arrays can be complete without causing extra runs.
- Once fixed, remove the `warn` overrides for `set-state-in-effect`, `static-components`, and `refs` in `eslint.config.mjs`.

### Done when

- [ ] `npm run lint` reports zero warnings
- [ ] The three overrides are removed from `eslint.config.mjs`
- [ ] Pre-commit ESLint hook (issue 26) fails on warnings (`--max-warnings=0`)
- [ ] Unit and Playwright tests pass and the app behaves as before
