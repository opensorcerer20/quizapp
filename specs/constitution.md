# Flashcard Library — Project Constitution

**Status:** v2 (derived from the codebase at v1.0.2, `README.md`, `temp/README_private.md`, and `docs/Flashcard Library App — Product Case Study.md`)
**Last updated:** 2026-08-03

## How to read this document

This constitution captures the intentions the app currently runs on so that future changes are made deliberately rather than by accident. It uses three levels:

| Level | Meaning |
|---|---|
| **MUST / MUST NOT** | A rule the source documents or code state explicitly as a constraint. Breaking it requires an explicit, recorded decision (see [Amendment](#13-amendment)). |
| **SHOULD** | A strong existing convention. Deviate when there is a reason; note the reason. |
| *Descriptive* | How the app works today. Not a rule. Free to change as the app evolves — this section exists to describe reality, not to defend it. |

Anything not written here is unconstrained. Silence is permission, not prohibition.

This document describes what the app is meant to be and the constraints it operates under. It is not a status report, a bug list, or a record of where the app is deployed.

---

## 1. Purpose

Flashcard Library is a mobile-first flashcard study app. A user loads or creates decks of question/answer pairs and studies them with an animated flip card — question on one side, answer on the other.

The founding scenario, unchanged since the beginning: *someone on a multi-country trip wants to learn a few words of each local language. They export a spreadsheet, load it into the app, and study on the go — no internet required.*

The app exists because of a specific gap. A survey of the Google Play marketplace in 2023 found flashcard apps that demanded permissions or logins, were cluttered with features the user did not ask for, carried third-party ads, or collected personal information. This app is deliberately the absence of all four. "Removes all of the bloat and focuses on being a tool to load flashcard decks to review as needed" is the product thesis, not a nice-to-have.

Over roughly a year the app generalized from the travel scenario into a general-purpose study tool, and shipped as a PWA.

**MUST:** studying a deck works with no network connection. Any new feature that requires the network must degrade gracefully to a fully usable offline app.

---

## 2. Product principles

### 2.1 Offline and private by default — MUST

- All user data lives on the device. There are no accounts, no sync service, no analytics, and no telemetry. Collecting no user data is a centerpiece of the product's privacy and trust claim, not an implementation detail that happens to be true today.
- The app **MUST NOT** transmit deck content, question content, or usage data off the device without an explicit user action (today the only such action is Export, which hands a file to the user's own chosen destination via the OS share sheet or a browser download).
- The author's personal identity is deliberately screened. Changes **MUST NOT** surface the author's personal contact details, address, or real-name attribution in shipped artifacts — app metadata, listings, bundle identifiers, build config, exported files, or the public repo. Publish under the business entity and the established pseudonymous channels only. This constraint has already shaped a major delivery decision (see §10) and is expected to keep doing so.

### 2.2 No accounts, no ads, no bloat — MUST

These are the specific failures the app was built to avoid, and they are binding:

- **No accounts or logins.** Beyond the privacy benefit, omitting account infrastructure is what made a solo build finishable — the overhead avoided is the reason the app exists at all.
- **No third-party advertising**, ever. Ads were one of the observed privacy problems with existing tools.
- **No unnecessary OS permissions.** Ask for a capability only when a user-visible feature cannot work without it.
- **No feature bloat.** A feature that does not serve loading, organizing, or reviewing flashcards needs a real justification. When in doubt, it belongs in Appendix A, not in the app.
- **Free to use.** Access carries no cost and no paywall. Monetization, if it ever happens, is voluntary (a tip) — never ads, never gating existing functionality.

### 2.3 Mobile-first — MUST

- The app is designed for a phone held in portrait. `app.json` pins `orientation: "portrait"` and `ios.supportsTablet: false`.
- The web build is the same phone UI: `_layout.jsx` renders a fixed-size "phone shell" (capped at 440 × 956) centered on larger screens, rather than reflowing to desktop.
- Larger layouts (tablet, multi-card grids) are a *planned* direction, not a current requirement. When they arrive they should extend this model ("if screen width > X, show more columns"), not replace the phone-first baseline.

### 2.4 Zero-friction start — SHOULD

- A first-time user with no data gets a demo deck loaded automatically (`loadDemoData`) plus first-run help, so the app is never an empty screen.
- Every destructive action is confirmed (delete deck, delete card, discarding an in-progress form). Leaving a screen with unsaved input **MUST** prompt before discarding.

### 2.5 The user's data is the user's — MUST

- Decks **MUST** remain exportable in a plain, re-importable text format. Export writes `question\nanswer\n...` grouped by deck, which is the same shape the TXT importer reads.
- No feature may make existing decks unreadable or unexportable.

---

## 3. Scope and capacity limits

These numbers are enforced in `src/common/constants.js` and were chosen deliberately (memory testing on real devices: "test full 20 decks with 50 questions each for memory issues").

**MUST** be enforced wherever decks or cards are created, imported, or edited:

| Limit | Value | Constant |
|---|---|---|
| Decks | 20 | `MAX_DECKS` |
| Questions per deck | 50 | `MAX_QUESTIONS` |
| Card text length | 240 chars | `MAX_CHAR_LIMIT` |
| Deck title length | 64 chars | (inline in `NewDeck.js`) |

The *values* are open to change — they are tuning parameters, not identity. What **MUST** hold:

- Limits are defined once in `constants.js` and referenced, never re-hardcoded at call sites.
- Import paths truncate rather than crash or silently corrupt when input exceeds a limit.
- Any increase to `MAX_DECKS` / `MAX_QUESTIONS` is re-validated for memory before shipping — that is what these numbers were set from.

*Descriptive:* font size is stepped by content length (`getFontSize`: xxl ≤ 20, xl ≤ 80, l ≤ 160, default above), and long card text is wrapped by `formatCardText`. This exists because font size changing card size caused layout bugs; the tiering approach is replaceable.

---

## 4. Data model

*Descriptive — this is the current shape, and it is expected to evolve.*

Two storage families, deliberately separated ("store QA data separate from deck list") so that listing decks does not require loading every question:

```
DECK_DATA            -> [ { id, name, createdAt }, ... ]        // the deck list
DECK_QA_<deckId>     -> { id, questions: [ {id, q, a, disabled}, ... ] }
THEME                -> "light" | "dark"
```

- `id` is a random integer 100000–999999, generated with collision retry (10 attempts).
- `disabled` marks a card as excluded from study without deleting it.
- Deck lists are sorted most-recent-first by `createdAt`.

**MUST:** all persistence goes through `src/common/fileLib.js`. Screens and components never call the storage API directly. `saveStorageData` and `loadStorageData` are intentionally module-private (the code says `// DO NOT EXPORT`) so the storage backend can be swapped without touching the UI. Add a named helper to `fileLib.js` instead of exporting the primitives.

**MUST:** storage stays local to the device. This is the mechanism behind the privacy claim in §2.1 — a remote or synced backend is not a drop-in substitution.

*Known rough edge, fair game to fix:* `fileLib.js` currently calls the web `localStorage` API directly and several `catch` blocks reference an undefined `key`. Centralizing was the point; the implementation behind it is not sacred.

---

## 5. Study behavior

### 5.1 Grab-bag randomization — MUST (it is the defining study behavior)

- Cards are shuffled once into a bag; each "next" pops one. No card repeats until the bag is empty.
- **"Start over" resets the current deck order; it does not re-shuffle.** "Remix" re-shuffles. These were separated on purpose and must stay distinguishable.
- Disabled cards are filtered out when the bag is built. If a deck has no enabled cards, the user gets an explanatory message pointing at the deck's card list — not an empty or broken screen.
- When the bag empties, it refills (currently by remixing).

*Descriptive:* additional modes are planned — full-random (card is not popped), single-pass with a hard end, quiz/multiple-choice, audio/hands-free, show-all-at-once. The architecture anticipates this: `QuizScreen.js` has a hardcoded `whichScreen = "review"` switch waiting for siblings to `ReviewScreen`. Adding modes is expected; they should not compromise grab-bag as the default.

### 5.2 Flip card — MUST

- A card shows one side at a time and flips on tap.
- **Advancing to a new card MUST show the un-flipped side.** This was a recurring bug ("answer visible when switching to next question"); the fix is remounting the card via a changed `key`. Any rewrite must preserve the guarantee, not necessarily the technique.
- The starting side (Q→A or A→Q) is user-selectable mid-session. This is not a convenience toggle: for language learning it is what lets the user drill from their native language *or* from the foreign language, which are different skills. Any redesign of the review screen keeps this reachable without leaving the session.

---

## 6. Import and export

### 6.1 Supported inputs — MUST

The design intent is that users prepare decks in whatever editor they already know, and that the app meets them there rather than forcing a proprietary flow.

- **TXT:** alternating lines — question on odd lines, answer on even lines. The original format, and the simplest thing a plain text editor can produce.
- **CSV:** two columns — question in column 1, answer in column 2. Added for people working in spreadsheets. Parsed by the project's own parser (`src/components/Deck/parseCsv.js`), not by a third-party library at runtime.
- **In-app entry:** a text box using the same alternating-line format as TXT, added for users who have no time or no access to prepare a separate file. One mental model across all three inputs.

Blank lines are dropped. An odd trailing line is discarded rather than paired with nothing.

### 6.2 CSV quoting — a recorded decision, open to revisit

The parser supports fully-quoted and fully-unquoted fields, escaped quotes (`\"` and `""`), triple quotes from Google Sheets, and commas inside quoted fields. Mixed quoting within a row was deliberately deferred because it materially increases parsing complexity.

**MUST:** a row that cannot be parsed yields a visible placeholder row (`["Could not parse csv", <first 50 chars>]`) — the import must never silently drop or mangle a row.

Mixed-quote support is an explicitly acknowledged future improvement, not a prohibition.

*Note:* Android reports CSV as `text/comma-separated-values`, not `text/csv`. Both are in `MIME_TYPE_CSV` and both **MUST** stay.

### 6.3 Export — MUST

Export produces a plain-text file named `export_YYYYMMDD_HHMMSS.txt`, decks most-recent-first, each preceded by a `===` / `=== Deck name: X` header.

Two delivery paths exist because the PWA has no native filesystem: web builds trigger a Blob download, native builds write to cache and hand off to the OS share sheet so the user picks the destination. **MUST** keep both paths working when touching Export. As of v1.0.2 the web path is the verified one; the native share-sheet path has not been re-verified since that change, so treat it as unconfirmed rather than known-good.

### 6.4 Input sanitization — MUST

All text originating outside the app — imported files, typed deck names, typed cards — passes through `sanitizeAll` (`sanitize-html`, all tags and attributes stripped) before being stored.

---

## 7. Architecture

*Descriptive, with a few load-bearing rules.*

```
src/
  app/          expo-router screens: index (deck list), NewDeck, QuizScreen, DeckScreen, AddQuestion
  common/       constants, storage (fileLib), theme/style tokens (lib), pure helpers (util)
  components/   reusable UI; Deck/ and Quiz/ for domain pieces; Providers/ for context
playwright-tests/tests/   end-to-end specs
```

- **Routing:** expo-router, stack-based, all screens `headerShown: false` — the app renders its own `Toolbar` instead. **MUST** keep real navigation for the hardware/browser back button; it must never exit the app from a sub-screen.
- **Screen shell:** screens compose `ScreenTemplate`, which supplies safe-area insets, background, and toolbar. New screens SHOULD use it rather than re-implementing chrome.
- **State:** local `useState` plus two contexts (`ThemeProvider`, `TranslationProvider`). There is no global store. Redux for the deck list has been floated as an option and remains open.
- **Cross-screen refresh:** navigation params (`RELOAD_LIST`, `NEW_QUESTION_ADDED`) and `useFocusEffect` signal a screen to re-read storage. Workable, and a fair target for something cleaner.
- **Modals:** presented as callouts from the toolbar/menu (`AppMenuModal`, `HelpModal`, `FileHelpModal`, `TutorialModal`, `InstallModal`, `ConfirmModal`). Modal styles were deliberately consolidated; new modals SHOULD reuse the existing components rather than adding another style family. **MUST:** the back affordance dismisses an open modal (with the unsaved-data warning where applicable) instead of navigating.

---

## 8. UI, theming, and styling

### 8.1 Theme — MUST

- Light and dark themes, toggled from the toolbar, persisted to storage, applied throughout.
- **Default-vs-saved resolution MUST follow the documented pattern:** theme state starts `null`, an effect reads storage on mount, a stored value wins, otherwise the device color scheme decides. The `null` initial value is what prevents the default from overwriting the saved choice — do not initialize it to a concrete theme.

### 8.2 Style rules — MUST

- Colors and shared style objects come from `src/common/lib.js` (`lightDarkStyles`, `globalStyles`), consumed via `getScheme(theme)`. Components **MUST NOT** hardcode theme colors.
- Styles live in `StyleSheet.create` blocks, not inline objects. This was an explicit pre-release cleanup ("move all 'style's to stylesheets") and holds for new code.
- `fontSize` (and numeric style values generally) **MUST** be numbers. Strings like `"1.2em"` or `"20px"` crash React Native.
- **MUST NOT** nest safe-area components. Insets are established once near the root; nesting causes layout breakage.

*Descriptive:* the palette is purple-accented (`#8B5DFF` family dark, `#C4A2E3` family light) on near-black / near-white backgrounds. Custom card themes and user-selectable color schemes are planned features — the palette is a current choice, not an identity.

### 8.3 Component library — SHOULD

`react-native-paper` (Material Design) is the UI library. It was chosen because CSS-utility approaches (TailwindCSS) did not translate to React Native. NativeWind is documented as a viable alternative worth evaluating — replacing Paper is a legitimate future direction, not a violation.

### 8.4 Layout gotchas worth preserving

*Descriptive, hard-won:*

- Flex containers carry `flex`/`flexDirection`/`justifyContent`; children generally do not.
- Vertical centering needs `alignItems: "center"`.
- Mixing `flex: N` on one child with a fixed `width` on a sibling fixes UI jitter.
- Resetting a reused component means changing its `key`.

---

## 9. Internationalization

*Descriptive — groundwork only, deliberately.*

All user-facing strings go through `getLocalString(...)` from `TranslationProvider`, which falls back to the key itself when no translation exists. `LANGUAGE_LIBRARY` is essentially empty; only `en` is wired, and device-locale detection is stubbed out.

**SHOULD:** keep wrapping new user-facing strings in `getLocalString` so the groundwork stays intact. Whether to actually complete multi-language support is an open question the private roadmap raised and never answered — deciding either way is fine.

A related, separate idea remains open: per-deck language assignment, which would let a future audio mode use the right TTS voice.

---

## 10. Delivery model

### 10.1 The PWA is the product — MUST

The app began as a native React Native build intended for the Apple App Store and Google Play. That path was deliberately abandoned, for two recorded reasons: submitting to the stores without disclosing the author's name or personal address requires standing up and maintaining a business entity, and a store presence obliges ongoing upkeep and re-testing against every OS release — an unbounded, open-ended cost for a solo maintainer with no plans to expand the team.

The PWA resolves both. It runs on web technology at versions the author pins and controls, so upkeep happens on the project's schedule rather than a platform vendor's, and it reaches users from any browser without an Apple or Google account standing in the way.

- The app **MUST** ship as an installable, offline-capable PWA: single-output Expo web, `standalone` display, service worker generated via `workbox-config.js`.
- Access **MUST NOT** require an app-store account, an install, or a payment.
- Changes **MUST NOT** reintroduce a hard dependency on an app-store release channel, or on any platform whose update cadence the project does not control.
- Dependency versions are pinned deliberately. Upgrades are a decision, not an obligation.

### 10.2 Native build — descriptive legacy

The repository retains the native scaffolding from the original plan: React Native 0.81 / Expo ~54 / React 19, expo-router 6, EAS build profiles, and `ios/` and `android/` directories. The minimums that were once binding — **iOS 17** and **Android API 32** (`minSdkVersion: 32`, `deploymentTarget: "17.0"`) — are recorded here as history, not as requirements.

Keeping native buildable is optional. Removing or letting go of native scaffolding is a legitimate cleanup, not a violation. Conversely, nothing here forbids a future native build — it would just be a new decision, made with the upkeep cost understood up front.

### 10.3 Build constraint that still bites — MUST

The `use-latest-callback: ^0.2.3` override in `package.json` **MUST NOT** be removed. Without it the FAB component throws `_useLatestCallback.default is not a function`. This affects the web build, so it is live, not legacy.

---

## 11. Testing and quality

*Descriptive, plus a small set of rules.*

- End-to-end tests are Playwright, run against the Expo web build (`npm test`). They cover the home screen, the add-deck modal, the review screen, card creation, and card flipping.
- Tests locate elements by `testID`. **SHOULD:** give new interactive elements a stable `testID` rather than depending on visible text.
- There is no unit test runner wired up today (a Jest config sits disabled in `temp/`). Randomized shuffle behavior in particular was noted as hard to test. Adding unit coverage is welcome.

**MUST** before a release:

- No `@todo` markers left in shipped source.
- Verify by hand in a mobile browser at phone viewport — both iOS Safari and Android Chrome. Automated tests run in desktop Chromium, and a long tail of past bugs (CSV import, keyboard covering inputs, toolbar inconsistency, modal dismissal) reproduced only on real mobile platforms.

*Conventions:* Prettier (`printWidth: 120`, double quotes, 2-space, semicolons, ES5 trailing commas), ESLint with the React plugin.

---

## 12. How this project makes decisions

*Working principles carried forward from how the app was actually built. SHOULD, not MUST — but they are why the app shipped.*

- **Timebox and defer, don't stall.** The established practice is to work from a visible to-do list and, when an item threatens the timeline, back it out and move it to the future-functionality list rather than letting it block. Appendix A is where those land. Deferring is a normal outcome, not a failure.
- **Scope the destination early, and re-check it.** The single most expensive lesson in this project was discovering the true cost of the intended endpoint (app-store release, its upkeep, and its entity requirement) far too late — after building toward it. Before committing to a direction, establish what the finish line actually requires, and re-confirm periodically that those requirements have not moved.
- **AI-assisted development trades depth for speed — pay the difference in review.** The author's own retrospective is explicit that AI assistance would have accelerated this build meaningfully, at the cost of intimate familiarity with the framework, and that it shifts the work from writing code to reviewing it. Where changes are AI-assisted, review effort scales with the speed gained; the constraints in this document are the checklist that review runs against.

---

## 13. Amendment

- **MUST/MUST NOT** items change only by editing this document in the same change that breaks them, with a one-line rationale. The point is that the reason is recorded, not that the rule is permanent.
- **SHOULD** items and *descriptive* sections can be updated freely as the app changes; keeping them accurate matters more than keeping them stable.
- If this document and the code disagree, that is a bug in one of them. Decide which, then fix it.

---

## Appendix A — Direction of travel

Mostly not commitments — recorded so that today's structure is understood as a starting point rather than a finished shape. The first item is the exception: it is the intended next piece of work.

**Spaced learning — the next feature.** Scheduling card review over increasing intervals so that material is revisited as it is about to be forgotten, rather than in a flat rotation. Specifics are open: the scheduling algorithm, what the user sees, how much control they get, and whether it becomes a mode alongside review or a property of a deck are all undecided.

The rationale is competitive parity. Spaced repetition is the learning strategy other flashcard apps are built around, and its absence is a real gap for anyone comparing this app against them. That makes it an exception to the anti-bloat rule in §2.2 rather than a violation of it: it serves reviewing flashcards, which is the app's core purpose.

Two structural notes for whoever designs it. It needs per-card state that does not exist yet — the current model carries only a `disabled` flag, so §4 will have to grow (review history, due dates, or whatever the chosen algorithm requires) and the storage shape will change. And it needs to coexist with grab-bag, which §5.1 makes binding: spaced learning schedules cards by *when they are due*, which is a different selection rule than *shuffle without repeats*. Adding it as an additional mode leaves grab-bag intact; changing what "next card" means inside review mode would not.

**Quiz mode.** The user picks the right answer from four choices. Distractors are generated from the deck itself, and at least one wrong answer is deliberately *similar* to the correct one, so the user has to discriminate rather than pattern-match. This similarity requirement is the substance of the feature — four random unrelated options would be a different, weaker thing.

**Audio / hands-free mode.** Text-to-speech card reading for review while commuting, driving, or otherwise away from the screen. In review mode: question is read, roughly five seconds elapse, answer is read. In quiz mode: only the question is read, with a longer pause (around ten seconds) to answer. Pause durations are configurable. A per-deck language assignment would let this pick the right TTS voice. Bluetooth connectivity was noted as a likely problem area.

**Disable cards from within review mode.** Cards can already be disabled from the deck's card list, and the review bag already honors the flag. What is missing is the in-session gesture: while reviewing, mark a card the user now knows so future sessions skip it. The control exists in `ReviewScreen.js` but is commented out.

**Other study modes:** full-random continuous (card is not popped); single-pass with a hard end and a disabled "next"; show-all-at-once; persisted mode selection; per-mode settings.

**Decks and cards:** edit existing cards; create a deck from an existing deck; split a large import into several decks; multi-file import; reorder the deck list by name or date; load from a Google Drive spreadsheet; record Q&A by microphone.

**Templated questions:** questions containing variables with a resolver that fills them per showing (`"If John has {apples[0]}..."`), to prevent rote memorization — including noun/verb slots for language decks.

**UI:** tablet / multi-column layout (with teacher feedback on a sketch first); swipe to advance; animated and swipeable help pages; custom card themes; dark-mode elevation via white overlay instead of shadows.

**Support:** a voluntary tip option after a usage threshold, consistent with §2.2 — never ads, never a paywall over existing functionality.

---

## Appendix B — Source documents

- `docs/Flashcard Library App — Product Case Study.md` (and the identical PDF) — the author's product case study: the competitive gap, the key design decisions and their rationale, the native-to-PWA pivot, refined feature specs, and retrospective lessons. The source for §1, §2.2, §10, §12, and most of Appendix A.
- `README.md` — current public readme (features, tech stack, roadmap, FAQ, completed milestones).
- `temp/README_private.md` — the raw predecessor: unfiltered roadmap, abandoned ideas (struck through), and the engineering notes that several MUST rules above are drawn from.
- The codebase at v1.0.2.
