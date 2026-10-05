title: Put a repository interface in front of localStorage
labels: architecture
section: Architecture
---
### Problem

Components call `fileLib.js` functions that use `localStorage` directly. That means:

- Native builds are broken, because `localStorage` does not exist in React Native.
- There is no clean place to add sync or a network API later.
- Deck-ID generation is duplicated in `DeckList.js` and `QuizDeck.js`.

### Fix

- Define a `DeckRepository` interface: `listDecks`, `getDeck`, `saveDeck`, `deleteDeck`, `updateQuestions`.
- Implement `LocalStorageDeckRepository` using the existing logic.
- Provide the repository through React context (or a small module), so components depend on the interface rather than on storage.
- Generate IDs in one place with `crypto.randomUUID()` instead of random 6-digit numbers with a retry loop. Keep existing numeric IDs readable so saved decks still load.

### Done when

- [ ] No component imports `localStorage` or `fileLib.js` directly
- [ ] ID generation exists in exactly one place
- [ ] Unit tests run against an in-memory implementation of the interface
