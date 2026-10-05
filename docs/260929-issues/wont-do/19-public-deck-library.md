title: Feature: public deck library (optional, network-backed)
labels: feature, architecture
section: Features
---
### Goal

Add one feature that uses a network API, without giving up the local-first, no-accounts design. It should demonstrate data fetching, loading, error, and empty states, caching, and pagination.

### Proposal

A **Browse Library** screen that lists public decks from a small backend. The user can search, preview a deck, and import it into local storage. Nothing is sent from the device unless the user chooses to publish.

- Backend: Supabase or Cloudflare Workers with D1. A single `decks` table and read-only public endpoints are enough to start.
- Client: TanStack Query for fetching, caching, and pagination.
- UI states: loading skeletons, error with retry, empty search results, and an offline message (the rest of the app keeps working offline).
- Optional later step: **Share deck** to publish a deck and get a link, with rate limiting and no account required.

### Alternatives considered

- **Share a deck by link only.** Smaller scope, still shows a full request and response cycle.
- **Google Sheets import** (already on the roadmap). Shows OAuth and a third-party API instead of a custom backend.

### Done when

- [ ] Browse, search, preview, and import work against the deployed backend
- [ ] Loading, error, empty, and offline states are all handled and covered by tests (mock the API in Playwright with `page.route`)
- [ ] The README and case study explain how this fits the local-first design
