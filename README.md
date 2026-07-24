# Flashcard Library

**A mobile-first flashcard app built with React Native and Expo.**

[![Version](https://img.shields.io/badge/version-1.0-blue)](https://github.com/opensorcerer20/quizapp/releases)
[![PWA](https://img.shields.io/badge/PWA-ready-brightgreen)](https://theotherjeff.site/flashcard_library/)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-lightgrey)](https://expo.dev)

Flashcard Library lets you load question-and-answer decks from CSV or text files, create decks manually in-app, and study them with an animated flip card interface. It runs as a PWA, and native iOS/Android builds are supported via EAS.

---

## About

The original idea: someone on a multi-country trip wants to learn a few words in each local language. They export a spreadsheet, load it into the app, and study on the go — no internet required.

Over a year of development, the app grew into a general-purpose study tool. It hit MVP in mid-2025 and was released as a PWA. The codebase is open to contributors who want to help take it further.

---

## Features

- **Flip card study mode** with animated card reveal
- **Grab-bag shuffle** — randomizes cards without repeats until the deck is exhausted
- **Import decks** from CSV or plain-text files
- **Create decks manually** in-app with a built-in card editor
- **Enable / disable individual cards** per deck
- **Deck management** — rename, delete, and export/backup decks
- **Swap Q&A sides** on demand mid-session
- **Light and dark themes** with persistence across sessions
- **PWA install support** — installable and works offline in the browser
- **Playwright end-to-end test suite**

---

## Try It

The app is live as a PWA:

> **[https://theotherjeff.site/flashcard_library/](https://theotherjeff.site/flashcard_library/)**

Install it from your browser for an app-like experience on mobile.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (~54) |
| Navigation | expo-router |
| UI components | react-native-paper |
| File access | expo-document-picker, expo-file-system, expo-sharing |
| CSV parsing | papaparse |
| Builds | EAS Build (iOS / Android) |
| Web / PWA | Expo web (single-page, standalone output) |
| Testing | Playwright |

Minimum supported versions: **iOS 17**, **Android API 32**.

---

## Getting Started

```bash
npm install
npx expo start          # start the dev server (Expo Go or dev build)
npx expo start --web    # run in browser / PWA mode
npx playwright test     # run the E2E test suite
npx playwright codegen --channel=chrome --device="" --viewport-size="1280,1020" # run big screen codegen
```

**Note:** The project includes a `package.json` override for `use-latest-callback` (`^0.2.3`) to resolve a runtime error in the FAB component. Don't remove it.

### Playwright commands

```bash
# Interactive debug UI
npx playwright test --ui

# Debug a specific test with the inspector
npx playwright test mytest.spec.ts --debug

# View the trace for a failed test
npx playwright show-trace test-results/my-test/trace.zip

# Generate tests against local dev server
playwright codegen localhost:8081
```

---

## Recent Updates

### 1.0.1: Reduce useEffect usage

### 1.0.2: Fix export bug for PWA

### 1.0.3: Migrate LocalStorage to IndexedDB

---

## Roadmap

### Proposed Future Features

- **Quiz mode** — multiple-choice answer selection
- **Car mode** — audio playback: hear question, pause, hear answer, repeat
- **Language mode** — assign a language per deck; car mode uses TTS in that language
- Reorder deck list (by name or date added)
- Continuous / full-random mode (no grab-bag, truly endless)
- Tablet layout (multiple cards visible at once)
- Edit existing questions within a deck
- Create a new deck from an existing one
- Import large CSV/TXT files and split into smaller decks
- Custom card themes / color schemes
- Swipe gesture to advance cards
- Load from Google Drive spreadsheet
- Record questions and answers via microphone
- Parent lock to hand off the device to a child or other student

### Completed milestones

Over a year of active development, this project went from a prototype to a fully featured PWA — completing closed beta testing, shipping dozens of UI and UX polish passes across iOS and Android, building a custom CSV parser, setting up an LLC, and tracking hundreds of granular improvements from the ground up.

<details>
<summary><strong>Show full completed roadmap</strong></summary>

-   [x] initial development
-   [x] first complete version
-   [x] complete alpha for testing
-   [x] apply alpha testing changes
-   [x] last changes before getting beta testers
-   [x] closed beta testing (started 7/24)
-   [x] set up llc

-   [x] load local text file, in form of "question\nanswer\nquestion\nanswer"
-   [x] allow user to choose local file and process (txt only)
-   [x] continuous mode: uses grab bag for randomization, always "next" button, never ends
-   [x] mode select: "continuous (grab bag)"
-   [x] dont change mode unless "Apply" button clicked
-   [x] reset deck when mode changes

-   [x] file location list

    -   [x] limit to 50 locations
    -   [x] save file location of load file to local storage
    -   [x] prevent adding same file twice
    -   [x] list saved file locations
    -   [x] load selected file
    -   [x] allow deleting file (from list of course)

-   [x] hide settings for other modes

-   [x] move deck functions into QuizScreen and out of App
-   [x] use shift for next question, unit test random sort
-   [x] unit testing and fix issue with next question

-   [x] allow csv file (good for lists that go `q | a` in rows)

    -   [x] make user pick type of file
        -   [x] extra FAB visible after pressing plus
        -   [x] extra FAB invisible when anywhere clicked
    -   [x] if text, use current code
    -   [x] if csv, parse according to csv rules

-   [x] bug: flip card not working
-   [x] bug: grab bag not working; getting full random instead
-   [x] chore: bag resets when empty
-   [x] chore: icon to delete list too small
-   [x] bug: clicking next question when answer showing should reset
-   [x] bug: answer visible when switching to next question
-   [x] bug: delay loading next question

-   [x] flip card showing outside safe container
-   [x] cant load csv file
-   [x] fix issue with answer showing for next question
-   [x] cut version 0.1 to reorg and clean up
-   [x] make prototype with fake data

-   [x] name of app is "flashcard library"
-   [x] toolbar should show different things, needs adjustment
-   [x] initial working light dark

-   [x] good ux design

    -   [x] safeareaview
    -   [x] use react native paper appbar
    -   [x] test question line length, limit as needed
    -   [x] test question length, limit as needed

-   [x] light dark in appbar
-   [x] test hardcoded 50 decks
-   [x] save static data to local storage
-   [x] test data load from storage (no app reload / app reload)
-   [x] implement importing list from txt file
-   [x] implement import from CSV
-   [x] limit imports to 50 questions
-   [x] char limit 90
-   [x] change font size based on text length
-   [x] add "sm" text size
-   [x] prev card, start over, grey out buttons
-   [x] "start over" button should reset current deck, not re-scramble
-   [x] store QA data separate from deck list

-   [x] confirm csv import is working

    -   [x] no quotes / full quotes / mixed quotes / escaped quotes / bad quotes
    -   [x] quotes include commas
    -   [x] support triple quote (from Google Sheets)
    -   [x] support slashed quote
    -   [x] confirm on android and ios
    -   [x] make csv parsing public

-   [x] when adding deck, modal to edit name (use filename as default, without extension)

    -   [x] functional modal
    -   [x] working modal (both add and edit deck)
    -   [x] polished modal

-   [x] deck menu (delete, edit name, dot menu)
-   [x] sanitize input
-   [x] issue with android importing csv

-   [x] char limit for deck list name
-   [x] save settings (light/dark) to storage and test on android + iphone
-   [x] button to "reverse" values on demand

-   [x] bug: loading from memory not working on refresh
-   [x] bug: sometimes "next question" at end ends up as blank card
-   [x] bug: clicking on deck does not load it; uses last deck
-   [x] fab.group causes error with useLatestCallback

-   [x] iphone (and galaxy) bugs

    -   [x] next/prev not showing
    -   [x] text for "swap q&a" not showing
    -   [x] switch for "swap q&a" colliding with "card x of y"

-   [x] test alpha version on android and iphone

-   [x] alpha bugs/improvements

    -   [x] deck rename not persisted
    -   [x] android back button exits app, need react navigation
    -   [x] list view to enable/disable cards
    -   [x] disable card in review view
    -   [x] move "deck list" operations to decklist, out of index
    -   [x] poker questions bugs (crowded layout, font size changes card size, overflow)
    -   [x] languages (groundwork)
    -   [x] deck rename with instructions and shadow visible
    -   [x] line breaks
    -   [x] fab visible in review screen
    -   [x] title bar background
    -   [x] change "quizapp" to "flashcard library"
    -   [x] do something about decklist multiple state vars
    -   [x] decklist menu can go off to the right
    -   [x] apply light/dark and purple theme throughout

-   [x] add themes for cards (apply light/dark to card theme)

-   [x] allow renaming saved file (modal with edit icon, save/cancel)

-   [x] last chance before beta

    -   [x] add help menu
    -   [x] deck name doesn't fit in toolbar — fixed
    -   [x] test full 20 decks with 50 questions each for memory issues
    -   [x] make new appbar (back/menu button, modals via callouts)
    -   [x] bugs: at least 1 test deck for android emulator, full list clips at bottom, simpler color scheme, more spacing between switches
    -   [x] app icon

    -   [x] very last tasks before beta build
        -   [x] remove all @todos
        -   [x] move all "style"s to stylesheets

-   [x] add file help (show first time with demo data, accessible from menu)

-   [x] make beta (android, iphone, beta testing via Expo)

-   [x] simple way to create a deck

    -   [x] textbox: name of deck
    -   [x] "textarea" for questions and answers (limit 50)
    -   [x] reload deck list after adding
    -   [x] add button to FAB
    -   [x] help/tutorial
    -   [x] on back click, confirm leave if there's content

-   [x] delete confirm

-   [x] closed android beta

-   [x] beta bugs/improvements

    -   [x] example image for file help doesn't fit
    -   [x] consolidate modal styles
    -   [x] make appbar consistent between ios and android
    -   [x] add cards to deck (fab, screen with blanks, working question add, character limits, cancel/back, modal to leave with content on screen)
    -   [x] ui consolidation (button style)
    -   [x] arrows for cards
    -   [x] keyboard covering textbox
    -   [x] dismiss ios keyboard by touching screen

    -   [x] allow commas in csv (custom AI-generated parser)

    -   [x] deck screen: delete questions for a deck
    -   [x] move deck list item out of deck list into its own component

-   [x] beta bugs/improvements (round 2)

    -   [x] back up to storage: write to cache, immediately share document (user chooses destination), tested android and ios
    -   [x] use react native Modal for modals (rename, consistent buttons, bg colors)

    -   [x] deck list

        -   [x] dark mode odd lighter shade for name and dots — fixed
        -   [x] slide for view
        -   [x] slide for delete

    -   [x] deck screen

        -   [x] slide for delete
        -   [x] deck rename

    -   [x] set up safe insets at top-ish level
    -   [x] gear background matches deck list item
    -   [x] MW title on deck list goes outside container — fixed

    -   [x] review screen: "MW" card goes bigger at bottom — fixed

    -   [x] general ui

        -   [x] eyes for visibility need emphasis
        -   [x] ios: rename deck popup has transparency — fixed
        -   [x] FAB covers right side of items — fixed with swipe-to-delete
        -   [x] fabs: csv option covered, trash hidden, fab distance/shadow inconsistency, replaced fab group with modal

    -   [x] deck screen item into separate component

-   [x] update all help screens (bigger text, file help renders example text/spreadsheet)

-   [x] slide delete same height as card
-   [x] handle android back button when modal is open (dismiss modal with warning)

-   [x] set up (but don't implement) language support

-   [x] check and resolve all @todos

-   [x] set minimum SDK versions (iOS 17, Android API 32)

</details>

---

## Contributing

The app is functional and shipped — the next phase is adding features and polishing for eventual app store release. Help is welcome on:

- Feature development (see the planned features list above)
- iOS / Android polish and compatibility testing
- App store submission and maintenance

To get involved, open an issue on GitHub or send an email to **opensorcerer20@gmail.com**.

---

## FAQ

**Why use react-native-paper?**
TailwindCSS and similar CSS utility libraries don't translate cleanly to React Native. react-native-paper provides a well-maintained Material Design component library that works consistently across iOS, Android, and web. (NativeWind is a viable alternative worth evaluating.)

**Why only support fully-quoted or unquoted CSV, not mixed?**
Supporting mixed quoting (some fields quoted, others not) significantly increases parsing complexity. The current parser handles the most common export formats from spreadsheet apps. Mixed-quote support is a candidate for a future improvement.
