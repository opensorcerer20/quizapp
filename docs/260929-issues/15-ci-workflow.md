title: Add GitHub Actions CI for lint, unit, and end-to-end tests
labels: tooling, testing
section: Testing and tooling
---
### Problem

Nothing runs automatically on pull requests, so a broken test or lint error can be merged without anyone noticing.

### Fix

Add `.github/workflows/ci.yml` that runs on pushes and pull requests to `master`:

1. `npm ci`
2. `npm run lint`
3. `npm run test:unit`
4. `npx playwright install --with-deps`, then `npm run test:e2e`
5. Upload the Playwright HTML report as an artifact when tests fail

Then add the CI status badge to the README, and turn on branch protection for `master` so the checks are required before merging.

### Done when

- [ ] CI runs on every PR and blocks merging when it fails
- [ ] The README shows a passing CI badge
