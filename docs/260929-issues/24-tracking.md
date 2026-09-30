title: Portfolio readiness: code quality, testing, and web front-end improvements
labels: tracking
---
This issue tracks a set of improvements for Flashcard Library that came out of a code review. The goals are to fix correctness bugs, add real test coverage and CI, adopt TypeScript in the data layer, and add a feature that uses a network API while keeping the app local-first.

Each item below links to its own issue. Items within a section are listed in the recommended order.

### Principles

- Keep the local-first, no-accounts design. Any network feature is optional and additive.
- Each item gets its own branch and PR. A PR closes its issue with `Fixes #<number>` in the description.
- No behavior changes in cleanup PRs.
