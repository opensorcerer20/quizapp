title: Add ESLint config and lint scripts
labels: cleanup, code-quality, enhancement, tooling
section: Testing and tooling
---
### Problem

ESLint and Prettier are installed, but there is no ESLint config and no `lint` script. Missing effect dependencies, hooks violations, and unused code are not caught automatically.

### Fix

- Add `eslint.config.js` using `eslint-config-expo` (flat config), which includes `react-hooks` rules.
- Turn on `react-hooks/rules-of-hooks` as an error and `react-hooks/exhaustive-deps` as a warning.
- Add scripts: `lint`, `lint:fix`, and `format:check`.
- Stop ignoring `.prettierrc.json` in `.gitignore` so contributors get the same formatting.

### Add

- Add formatting hook for git
- Format all code
- Confirm no functional changes

### Done when

- [ ] `npm run lint` passes with zero errors
- [ ] Remaining warnings are either fixed or listed in a follow-up issue
- [ ] Pre commit format hook added and working
- [ ] All files formatted and committed

### Changelog (changes after the issue was created)

- Added formatting precommit hook and formatting all code to issue
- eslint-config-expo was vetoed by human in favor of existing eslint.config.mjs
