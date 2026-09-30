title: Fix undefined variable in fileLib.js error handlers
labels: bug
section: Correctness fixes
---
### Problem

Several `catch` blocks in `src/common/fileLib.js` log a variable named `key` that is not defined in that function:

- `loadDeckFromStorage` (line 116)
- `saveDeckListData` (line 156)
- `saveDeckData` (line 166)
- `updateDeckQuestionData` (line 179)

If one of these catch blocks runs, it throws a `ReferenceError`, so the error handler itself crashes instead of logging.

### Fix

- Log values that exist in scope, such as `deckId` or the storage key built in that function.
- Log the error itself (`error.message`) instead of `JSON.stringify(Object.keys(error))`, which usually prints `[]` for `Error` objects.
- Consider one small `logStorageError(action, key, error)` helper so the pattern is consistent.

### Done when

- [ ] Every catch block in `fileLib.js` references only variables in scope
- [ ] A unit test forces `localStorage.setItem` to throw and confirms the function returns `false` without crashing
