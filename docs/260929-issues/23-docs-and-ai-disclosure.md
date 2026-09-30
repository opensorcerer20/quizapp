title: Update README and case study (AI disclosure, native status, testing)
labels: docs
section: Cleanup and docs
---
### Problem

- `parseCsv.js` says the parser was "generated via Cursor prompting", and the README calls it a "custom AI-generated parser". The project's description of AI use should match what is in the code.
- The README lists Android and iOS scaffolding as legacy, but does not say that native builds no longer work because of the switch to `localStorage`.
- The README roadmap says unit testing and sanitization are complete. Until the related issues are fixed, those items are not accurate.

### Fix

- Add a short **How this was built** section that states plainly which parts were written by hand and which used AI tools (Cursor for the CSV parser, Claude for test scaffolding), and how AI-generated code was reviewed and tested.
- State the native build status clearly, or restore it after the repository issue is done.
- Update the Getting Started and testing sections to match the new scripts and CI.
- Add Lighthouse scores and the CI badge once they exist.

### Done when

- [ ] The README, case study, and code comments tell the same story
- [ ] Every completed roadmap item is actually true
