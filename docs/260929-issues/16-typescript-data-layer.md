title: Migrate the data layer to TypeScript
labels: typescript, architecture
section: Architecture
---
### Problem

The codebase is plain JavaScript and `tsconfig.json` is empty. TypeScript is is widely used, and the data shapes (`Deck`, `DeckData`, `Question`) are currently implicit.

### Fix

Migrate incrementally, starting where types pay off most:

1. Add `src/types.ts` with `Deck`, `DeckData`, `Question`, and `Theme` types.
2. Convert `src/common/fileLib.js`, `util.js`, and `constants.js` to `.ts`.
3. Convert `src/components/Deck/QuizDeck.js` and `parseCsv.js`.
4. Convert the providers (`ThemeProvider`, `TranslationProvider`) and give their contexts proper types instead of `null`.
5. Turn on `"strict": true` in `tsconfig.json` once the converted files pass.

Components can follow in later PRs.

### Done when

- [ ] Steps 1–5 are merged
- [ ] `npx tsc --noEmit` passes and runs in CI
