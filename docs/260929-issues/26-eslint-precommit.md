title: Run ESLint in the pre-commit hook
labels: tooling
section: Testing and tooling
---
### Problem

The husky pre-commit hook runs `lint-staged`, which only runs Prettier. Lint errors are only caught when someone runs `npm run lint` by hand.

### Fix

- Update `lint-staged` in `package.json` so staged `js`, `jsx`, `mjs`, `cjs`, `ts`, and `tsx` files run `eslint --fix` before Prettier.
- Block on errors only. Existing `react-hooks` warnings are handled in issue 25, which switches the hook to `--max-warnings=0`.

### Done when

- [ ] Committing a staged file with a lint error is blocked
- [ ] Committing a staged file with only existing warnings succeeds
- [ ] Non-lintable files (`json`, `md`) still get Prettier only
