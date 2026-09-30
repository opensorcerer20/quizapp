title: Remove unnecessary async/await and the reload-flag effect
labels: architecture, code-quality
section: Architecture
---
### Problem

- Synchronous `localStorage` functions are called with `await`, and synchronous work is wrapped in `async` functions inside effects (for example in `DeckList.js` and `ThemeProvider.js`). This suggests confusion about async code.
- `DeckList.js` uses a `reload` boolean in state to trigger a `useEffect` that refetches. This is a known anti-pattern: it causes extra renders and makes the data flow hard to follow.
- The import `useEffect` in `DeckList.js` is missing dependencies.

### Fix

- Remove `async` and `await` where nothing asynchronous happens. Keep them for real async work such as `DocumentPicker` and `fetch`.
- Replace the reload flag with a direct call to a `refreshDecks()` function after each mutation, or move deck state into a small store or context.
- Trigger the import directly from `onPressImport` after a file is picked instead of routing it through state and an effect.

### Done when

- [ ] No `await` on synchronous functions
- [ ] The `reload` state and its effect are gone
- [ ] `react-hooks/exhaustive-deps` reports no warnings in `DeckList.js`
