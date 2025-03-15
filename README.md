# quizapp
Generic React Native Expo app to ask questions from a given JSON file after shuffling them randomly. Once the quiz is done, reload and reshuffle.

## Overall Aim
Initial idea: someone going on a multi country tour, wants to learn the local language at each place, so they load a file of language each time, and can do a flip card quiz on the go

## FAQ
- Why use react native paper?
  - TBD (I remember trying to use tailwind and/or chakra but hit a problem; don't remember what problem)

## notes
- issue: using Text with style fontSize with either "1.2em" or "20px" caused it to crash; just use numbers I guess?

## Planned future features
(**E**)asy, (**H**)ard
- [x] load local text file, in form of "question\nanswer\nquestion\nanswer"
- [x] allow user to choose local file and process (txt only)
- [x] continuous mode: uses grab bag for randomization, always "next" button, never ends
- [x] mode select: "continuous (grab bag)"
- [x] dont change mode unless "Apply" button clicked
- [x] reset deck when mode changes

- [ ] file location list
  - [ ] (E) limit to 50 locations
  - [x] (H) save file location of load file to local storage
  - [ ] prevent adding same file twice
  - [x] list saved file locations
  - [x] load selected file
  - [ ] allow deleting file (from list of course)


- [ ] (H) move deck functions into separate file

- [ ] allow csv file (good for lists that go `q | a` in rows)
  - [ ] make user pick type of file
    - [ ] (E) extra FAB visible after pressing plus
    - [ ] (E) extra FAB invsibile when anywhere clicked
  - [ ] (E) if text, use current code
  - [ ] (H) if csv, parse according to csv rules

- [ ] good ux design
  - [x] safeareaview
  - [ ] (H) use react native paper appbar

- [ ] apply themes
  - [ ] (H) light dark

- [ ] launch 1.0

## Possible future dev
  - [ ] allow renaming saved file (modal)
    - [ ] (E) edit icon
    - [ ] (E) modal to edit string
    - [ ] (H) "save" to save edit
    - [ ] (E) "cancel" or click away to cancel
- more modes
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
