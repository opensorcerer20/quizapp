# quizapp
Generic React Native Expo app to ask questions from a given JSON file after shuffling them randomly. Once the quiz is done, reload and reshuffle.

## Overall Aim
Initial idea: someone going on a multi country tour, wants to learn the local language at each place, so they load a file of language each time, and can do a flip card quiz on the go

## FAQ
- Why use react native paper?
  - TBD (I remember trying to use tailwind and/or chakra but hit a problem; don't remember what problem)
- Why is the unit testing not robust, eg testing for precise button ids?
  - I tried to get this working, but the immediate issue is that it doesn't response to specific ids. For example i tried data-testid="button-next" but it didn't see it

## notes
- issue: using Text with style fontSize with either "1.2em" or "20px" caused it to crash; just use numbers I guess?
- couldn't see a way to test random sort
- if you get error "you probably forgot to export..." make sure you use the right import eg "import {FlipCard}..." or "import FlipCard..."
- cant console log the "response" when fetching a file
- oops, dont nest "safe area"

## Planned future features
(**E**)asy, (**H**)ard
- [x] load local text file, in form of "question\nanswer\nquestion\nanswer"
- [x] allow user to choose local file and process (txt only)
- [x] continuous mode: uses grab bag for randomization, always "next" button, never ends
- [x] mode select: "continuous (grab bag)"
- [x] dont change mode unless "Apply" button clicked
- [x] reset deck when mode changes

- [x] file location list
  - [x] (E) limit to 50 locations
  - [x] (H) save file location of load file to local storage
  - [x] prevent adding same file twice
  - [x] list saved file locations
  - [x] load selected file
  - [x] allow deleting file (from list of course)

- [x] hide settings for other modes

- [x] move deck functions into QuizScreen and out of App
- [x] use shift for next question, unit test random sort
- [x] unit testing and fix issue with next question

- [x] allow csv file (good for lists that go `q | a` in rows)
  - [x] make user pick type of file
    - [x] (E) extra FAB visible after pressing plus
    - [x] (E) extra FAB invsibile when anywhere clicked
  - [x] (E) if text, use current code
  - [x] (H) if csv, parse according to csv rules

- [x] bug: flip card not working (i bet this was working, but it was the memory bug i saw)
- [x] bug: grab bag not working; getting full random instead
  - [x] looks like bag resets when next question pressed
- [x] chore: not sure if bag resets when empty
- [x] chore: icon to delete list too small
- [x] bug: clicking next question when answer showing should reset
- [x] bug: answer visible when switching to next question
- [x] bug: delay loading next question (side effect of hiding answer to next question)

(shifting focus to ui first)

- [ ] apply themes
  - [ ] (H) light dark

- [ ] good ux design
  - [x] safeareaview
  - [ ] (H) use react native paper appbar

- [ ] utilize custom hooks (same as react component but returns value not component)

- [ ] bug: loading from memory not working
  - [ ] actually, memory works until page refreshed
- [ ] bug: (recent?) sometimes "next question" at end ends up as blank card
- [ ] bug: clicking on deck does not load it; uses last deck 

- [ ] test alpha version in android
  - [x] flip card not working
    - [x] ~~issue with absolute~~
  - [x] flip card showing outside safe container
  - [x] no next button
  - [ ] loading deck from start doesnt work (cant click)
  - [ ] cant load csv file

- [x] test question line length, limit as needed
- [ ] test question length, limit as needed

- [ ] (H) code cleanup

- [ ] launch 1.0

## Possible future dev
  - [ ] now that everything is done, can the code be redone for better organization?
  - [ ] allow renaming saved file (modal)
    - [ ] (E) edit icon
    - [ ] (E) modal to edit string
    - [ ] (H) "save" to save edit
    - [ ] (E) "cancel" or click away to cancel
- more modes
  - [ ] show settings for other modes
  - [ ] mode select: "continuous (full random)"
    - almost same as grab bag, but question is NOT popped off, next question full random
  - [ ] persist mode select
    - [x] persist in app memory
    - [ ] persist in device storage
  - [ ] mode select: "single time"
    - [x] show number of cards remaining in deck
    - [ ] button to restart deck (always shown)
    - [ ] disable "next" button at end of deck
  - [ ] settings drawer with gear access
    - [ ] use small icons for settings 
  - [ ] new mode: show all cards at once
- load Google Drive spreadsheet
- Questions with random content with a variable and its resolver
  - enables more variance in questions to prevent rote memorization, e.g. different numbers of apples each time
  - Example question "If John has `{apples[0]}` and Jane has `{apples[1]}` and she gives John `{apples[2]}`, how many does John have?" "Answer: `{apples[3]}`"
  - resolver `apples()` fills question and answer after it fills in values such as `["2 apples", "1 apple", "1 apple", "3 apples"]`
  - in the case of language, have something like `{noun}` with a list of nouns that can be used to make the question, and `{verb}` with a list of verbs they can choose from
