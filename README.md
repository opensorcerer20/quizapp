# quizapp
Generic React Native Expo app to ask questions from a given JSON file after shuffling them randomly. Once the quiz is done, reload and reshuffle.

## Overall Aim
Initial idea: someone going on a multi country tour, wants to learn the local language at each place, so they load a file of language each time, and can do a flip card quiz on the go

## Planned future features
- [x] load local text file, in form of "question\nanswer\nquestion\nanswer"
- [x] allow user to choose local file and process (txt only)
- [x] continuous mode: uses grab bag for randomization, always "next" button, never ends
- [ ] new "one deck only" mode
  - [ ] show cards remaining in deck
  - [ ] button to restart deck (always shown)
  - [ ] disable "next" button at end of deck
- [ ] save file location of load file to local storage
- [ ] list saved file locations
- [ ] allow renaming saved file (modal)
- [ ] allow csv file (good for lists that go `q | a` in rows)
  - issue: cant tell difference between csv and text


## Possible future dev
- load Google Drive spreadsheet
- Questions with random content with a variable and its resolver
  - enables more variance in questions to prevent rote memorization, e.g. different numbers of apples each time
  - Example question "If John has `{apples[0]}` and Jane has `{apples[1]}` and she gives John `{apples[2]}`, how many does John have?" "Answer: `{apples[3]}`"
  - resolver `apples()` fills question and answer after it fills in values such as `["2 apples", "1 apple", "1 apple", "3 apples"]`
  - in the case of language, have something like `{noun}` with a list of nouns that can be used to make the question, and `{verb}` with a list of verbs they can choose from


