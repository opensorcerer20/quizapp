title: Fix Playwright port mismatch and unawaited assertions
labels: testing, bug
section: Testing and tooling
---
### Problem

- `playwright.config.js` sets `baseURL` to `http://localhost:8181` and starts the dev server on port 8181. Several tests hard-code `http://localhost:8081/` instead (`app.spec.ts` lines 61, 89, 130 and `addquestion.spec.ts` line 14). Those tests only pass if a second dev server happens to be running on 8081.
- `addquestion.spec.ts` line 28 calls `expect(...).toBeVisible()` without `await`, so the assertion never runs.
- Some tests are commented out, and only Chromium is enabled.

### Fix

- Replace hard-coded URLs with `page.goto('/')` so every test uses `baseURL`.
- Add `await` to every web-first assertion. The `@typescript-eslint/no-floating-promises` rule catches this automatically.
- Either fix or delete the commented-out tests.
- Enable the `Mobile Safari` and `Mobile Chrome` projects, since this is a mobile-first PWA.

### Done when

- [ ] `npx playwright test` passes with no other dev server running
- [ ] Tests pass on Chromium, WebKit, and at least one mobile viewport
- [ ] No commented-out tests remain
