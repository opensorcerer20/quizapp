title: Remove dead code, debug logging, and misplaced dependencies
labels: cleanup
section: Cleanup and docs
---
### Problem

- `parseCsv.js` still contains two `@deprecated` parsers (`parseRawCsv` and `parseCsv`). `papaparse` is a dependency only because of them.
- There are about 32 `console.log` calls in `src/`, plus commented-out code in several files.
- `playwright` and `@testing-library/*` are listed under `dependencies` instead of `devDependencies`. `@testing-library/*` appears to be unused.
- `@babel/core` is listed in both `dependencies` and `devDependencies`.
- `eas_backup.json` and `eas_example.json` are committed, and `lib.js` has a duplicate `bottom` key in `globalStyles.fab`.

### Fix

- Delete the deprecated parsers and remove `papaparse`.
- Replace `console.log` with a small `logger` module that does nothing in production builds, or remove the calls.
- Delete commented-out code. Git history keeps it.
- Move test tools to `devDependencies` and remove unused packages.

### Done when

- [ ] No `@deprecated` code or commented-out blocks remain in `src/`
- [ ] `npm ls` shows no unused runtime dependencies
- [ ] The app and all tests behave exactly as before
