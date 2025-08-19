# Flashcard Library

Generic React Native Expo app to ask questions from a given question file after shuffling them randomly. Once the quiz is done, reload and reshuffle.

## Overall Aim

Initial idea: someone going on a multi country tour wants to learn the local language at each place. With this app, they can load a file of terms to learn for each language, and can do a flip card quiz on the go.

## Roadmap

- [x] initial development
- [x] first complete version
- [x] complete alpha for testing
- [x] apply alpha testing changes
- [x] last changes before getting beta testers
- [ ] closed beta testing (started 7/24)
- [ ] set up llc
- [ ] open beta testing
- [ ] apply beta testing changes
- [ ] launch 1.0!

## FAQ

-   Why use react native paper?
    -   I don't remember, but I think it was because I tried to use TailwindCSS and the CSS library didn't work as expected. I know now that some libraries do work, e.g. Bootstrap
    -   Looks like "NativeWind" can be used
-   Why not support mixed quotes for csv parsing?
    -   I only support either zero quotes or full quotes for csv. Attempting to code for a combination of quoted and unquoted values increases the required parsing logic, so I put that off.

## notes

-   issue: using Text with style fontSize with either "1.2em" or "20px" caused it to crash; just use numbers I guess?
-   couldn't see a way to test random sort
-   if you get error "you probably forgot to export..." make sure you use the right import eg "import {FlipCard}..." or "import FlipCard..."
-   cant console log the "response" when fetching a file
-   oops, dont nest "safe area" components, it causes problems
-   how to "reset" a reused react component: change the key="" attribute; that tells react that it's a totally different component, and it discards the previous
    -   this was needed for when a card is flipped, then the next question clicked; the card was still flipped, so the answer for the next question was visible
-   how to get a drawer: for expo, it has documentation at https://docs.expo.dev/router/advanced/drawer/
-   how does flex work for react native
    -   the container has flex, flexDirection, justifyContent
    -   the children do NOT have flex
-   flex box and buttons
    -   need additional "alignItems" to "center" for vertical centering
-   fixing "uselatestcallback" error
    -   had to add an override in package.json: "overrides": { "use-latest-callback": "^0.2.3" }
-   default theme vs saved theme
    -   to have a default theme that doesnt override saved them
        -   use default value of "null"
        -   useeffect to run code at start
        -   try to load theme value from memory
        -   if not null, use that value
        -   else use a specified default value
-   for android, the csv mime type is "text/comma-separated-values"
-   getting text vertically centered for listview
```
item: {
    flexDirection: "row",
    alignItems: "center", // centers vertically
},
itemText: {
    flex: 10,
},
itemMenuButton: {
    flex: 1,
},
```
-   to color icon on button for react native paper, use textColor attribute
-   for ios build
    - eas device create
    - install (policy?) on device
    - eas build preview
    - scan qr code to install via itunes
- for fab.group, setting fab button color required using fabstyle attribute
- tricky bit where the card can be "disabled" but switch indicated "enabled", and setting it to the other value was the opposite boolean result
- expo multiple file selection
```
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: false,
    });
    if (result.type === "success") {
      // result.output is an array when multiple is true
      setFiles(result.output || [result]);
    }
```
- incredibly important note with flexbox if you have "jitter" of ui components: you can mix "flex: #" and "width: #"
```
<Component1 style={{ flexDirection: "row" }}>
  <Component2 style={{ flex: 10 }} />
  <Component3 style={{ width: 55 }} />
</Component1>
```
- beta testing ios requires using testflight: https://docs.expo.dev/tutorial/eas/ios-production-build/

## Current Roadmap Development

- [x] Simple way to create a deck
    - [x] textbox: name of deck
    - [x] "textarea" where questions are on odd lines and answers on even lines
        - [x] limit 50 questions
    - [x] reload deck list
    - [x] add button to FAB (and shrink space between buttons)
    - [x] help or tutorial
    - [x] on back click, confirm leave if theres content

- [x] delete confirm

- [x] closed android beta

- [ ] beta bugs/improvements
    -   [x] example image for file help doesnt fit
    -   [x] quizmodal move inside menu component
    -   [x] consolidate modal styles (very similar)
    -   [x] make appbar consistent between ios and android
    -   [x] add cards to deck
      -    [x] fab
      -    [x] screen w blanks
      -    [x] working question add
      -    [x] deck name on add screen
      -    [x] input labels on screen
      -    [x] issue with back button after adding question, stack is incorrect, goes back to same page
      -    [x] character limits
      -    [x] test cancel/back
      -    [x] test modal to leave with info on screen
      -    [x] use different color for fab than list items
      -    [x] new issue: submitting does not ALWAYS refresh list (try going in from start after refresh, attempt to submit with only question, then with answer, see if list refreshes)
    -   [x] ui consolidation
      -    [x] button style
    -   [x] arrows for cards
    -   [x] keyboard covering textbox
    -   [x] dismiss ios keyboard by touching screen ("expo ios hide keyboard")
    -   [ ] delete questions for a deck
    -   [ ] edit questions for a deck (using addquestion)
    -   [ ] education: make available for tablets
      -   [ ] ui
        -   [ ] use similar idea to "mobile first": if screen width > ?, show more columns
        -   [ ] 4-6 cards, 2-3 per row
        -   [ ] in quiz mode, 1 row, 3 cards with responses below
    -   [ ] back up to storage
        -   [ ] needed because with adding questions, files no longer have all questions
    -   [ ] language support
    -   [ ] import big csv/txt file into smaller decks?
    -   [ ] multi file select
    -   [ ] order list by name, date added
    -   [ ] quickly: quiz mode
    -   [ ] quickly: use redux for deck list state
    -   [ ] use white overlay for dark theme to indicate height (instead of shadows)
    -   [ ] decklistmenu and deckrenamemodal need to include quizmodal and basebg3
    -   [ ] file help
        - [ ] animation when changing help pages
        - [ ] swipe between help pages
    -   [ ] MW an issue: causes card to go bigger at bottom
    -   [ ] theme does not respond to very first click with no setting, so no default is set upon launch
    -   [ ] pressing android back button on new deck discards form
    -   [ ] color blind mode (ouch)
    -   [ ] app icon needs to come down 2 pixels i think
    -   [ ] handle android back button to launch confirm modal (new deck, add question, etc) ("expo detect android back")

- [ ] llc

- [ ] set up ios app on TestFlight
    - [ ] need po box
    - [ ] need llc
    - [ ] need DUNS (unique id for app store) and EIN (for tax purposes)
    - [ ] set up organization account on apple app store (which hides developer name)
- [ ] set up app on google play beta

- [ ] confirm my personal info is hidden

- [ ] open beta

- [ ] add tip to menu (needs llc name)
    -   [ ] (free users only) tips: after certain amount of uses, tip popup with option to "dont show again"
    -   [ ] tip button (https://buymeacoffee.com/)

- [ ] app store page
    -   [ ] link to repository
    -   [ ] instructions to build

-   [ ] launch 1.0


## Possible future dev

-   new feature: quiz mode
-   new feature: audio playback
-   reorder deck list
-   make new deck from existing deck
-   custom card themes
-   swipe to next card ("swipe gesture" plus animation)
-   mode select: "continuous (full random)"
-   persist mode select
-   new mode: show all cards at once
-   ? load Google Drive spreadsheet
-   Questions with random content with a variable and its resolver
-   record question/answer via microphone
-   new feature: parent mode

## Completed Roadmap Development
<details>
<summary>
<strong>Show completed roadmap</strong>
</summary>

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
        -   [x] extra FAB invsibile when anywhere clicked
    -   [x] if text, use current code
    -   [x] if csv, parse according to csv rules

-   [x] bug: flip card not working (i bet this was working, but it was the memory bug i saw)
-   [x] bug: grab bag not working; getting full random instead
    -   [x] looks like bag resets when next question pressed
-   [x] chore: not sure if bag resets when empty
-   [x] chore: icon to delete list too small
-   [x] bug: clicking next question when answer showing should reset
-   [x] bug: answer visible when switching to next question
-   [x] bug: delay loading next question (side effect of hiding answer to next question)

-   [x] flip card not working
    -   [x] ~~issue with absolute~~
-   [x] flip card showing outside safe container
-   [x] no next button
-   [ ] ~~loading deck from start doesnt work (cant click)~~
-   [x] cant load csv file

-   [ ] ~~new idea: pre-render cards, click to next and previous, reset when leaving screen~~

-   [ ] ~~create all cards, only show current one~~

-   [x] fix issue with answer showing for next question

-   [x] cut version 0.1 to reorg and clean up

-   [x] make prototype with fake data

(shifting focus to ui first)

-   [x] name of app is "flashcard library"

-   [x] toolbar should show different things, needs adjustment

-   [x] initial working light dark

-   [x] good ux design

    -   [x] safeareaview
    -   [x] use react native paper appbar
    -   [x] test question line length, limit as needed
    -   [x] test question length, limit as needed
    -   [ ] ~~bottom appbar? https://callstack.github.io/react-native-paper/docs/components/Appbar/~~

-   [x] light dark in appbar

-   [x] test hardcoded 50 decks

(back to using file imports)

-   [x] save static data to local storage
-   [x] test data load from storage

    -   [x] no app reload
    -   [x] app reload

-   [x] implement importing list from txt file
-   [x] test data load from storage

    -   [x] no app reload
    -   [x] app reload

-   [x] implement import from CSV

    -   [x] no app reload
    -   [x] app reload

-   [x] limit imports to 50 questions

-   [x] char limit 90

-   [x] change font size based on text length

-   [x] add "sm" text size

-   [x] prev card, start over, grey out buttons

(issues requiring concentration)

-   [x] "start over" button should reset current deck, not re-scramble

-   [x] store QA data separate from deck list

    -   [x] solution one: use keys similar to "user.email" "user.phone"
    -   [x] new func "makeNewDeckData" with {id, questions}

-   [x] confirm csv import is working

    -   [x] no quotes
    -   [x] full quotes
    -   [x] mixed quotes
    -   [x] escaped quotes
    -   [x] bad quotes
    -   [x] quotes include commas
    -   [x] support triple quote (from sheets)
    -   [x] support slashed quote
    -   [x] confirm
        -   [x] android
        -   [x] ios
    -   [x] make my csv parsing public (kinda)

-   [x] when adding deck, modal to edit name (use filename as default, without extension)

    -   [x] functional modal
    -   [x] working modal (both add and edit deck)
    -   [x] remove "cancel" when adding deck
    -   [x] possible refresh issue: if done after adding deck, it adds it again
    -   [x] polished modal
    -   [ ] ~~see if a generic modal component can be made~~

-   [ ] ~~deck info: filename, date added~~

-   [x] deck menu

    -   [x] delete
    -   [x] edit deck name
    -   [x] dot menu, no long press

-   [x] sanitize input

-   [ ] ~~utilize custom hooks (same as react component but returns value (and callback) not component)~~

-   [x] issue w android importing csv

(continue list)

-   [x] char limit for deck list name

-   [ ] ~~slide menu for deck list~~
    -   [x] tried react native elements, not great

-   [x] save settings (light/dark) to storage

    -   [x] save setting and load setting
    -   [x] test on android
    -   [x] test on iphone

-   [x] button to "reverse" values on demand

-   [x] bug: loading from memory not working on refresh
    -   [x] shift from storing file info to just saving question/answers
-   [x] bug: (recent?) sometimes "next question" at end ends up as blank card
-   [x] bug: clicking on deck does not load it; uses last deck

-   [x] fab.group causes error "Warning: TypeError: 0, \_useLatestCallback.default is not a function (it is undefined)"

-   [x] iphone (and galaxy) bugs

    -   [x] next/prev not showing
    -   [x] text for "swap q&a" not showing
    -   [x] switch for "swap q&a" colliding with "card x of y"

-   [x] test alpha version self

    -   [x] create development build
    -   [x] android
    -   [x] iphone

-   [ ] alpha bugs/improvements
    -   [x] deck rename not persisted
    -   [x] android back button exits app, need react navigation
    -   [x] list view to enable/disable cards
    -   [x] disable card in review view
    -   [ ] ~~switch to show disabled cards in review view~~
    -   [x] move "deck list" operations to decklist, out of index
    -   [x] poker questions bugs found
        -   [x] crowded on left side, like line limit is too small
        -   [x] related to above, large font size changes card size
        -   [x] now it's too big, getting breaks too late
            - [x] odd, do i even need to check line length? it seems to be working without that
        -   [x] overflow on viewing deck cards 6-17 2:45:49
    -   [ ] ~~user settings~~
        -   [ ] ~~settings gear~~
        -   [ ] ~~card color (q & a)~~
        -   [ ] ~~background image~~
    -   [x] languages (groundwork)
    -   [x] deck rename
        -   [x] instructions
        -   [x] shadow visible
    -   [ ] quiz mode (only if it's quick)
    -   [x] line breaks
    -   [x] fab visible in review screen
    -   [x] title bar background
    -   [ ] ~~app icon~~
    -   [x] change "quizapp" to "flashcard library"
    -   [x] do something about decklist multiple state vars
    -   [x] decklist menu can go off to the right
    -   [x] apply light/dark and purple theme throughout

-   [ ] ~~launch critical bugs~~

    -   [ ] ~~csv must have all quotes or it doesnt work right~~
    -   [ ] ~~handle different text sizes (device might have non-default sizes)~~
    -   [ ] ~~deck name doesnt fit in toolbar~~
    -   [ ] ~~need to test full 20 decks with 50 questions each to see if memory is an issue~~

-   [x] add themes for cards

    -   [x] apply light/dark to card theme
    -   [ ] ~~keep original colors~~
    -   [ ] ~~add white/grey note card~~

-   [x] allow renaming saved file (modal)
    -   [x] edit icon
    -   [x] modal to edit string
    -   [x] "save" to save edit
    -   [x] "cancel" or click away to cancel

-   [ ] last chance before beta

    -   [x] add help menu
    -   [x] deck name doesnt fit in toolbar

    -   [x] need to test full 20 decks with 50 questions each to see if memory is an issue
    -   [x] make new appbar
        - [x] new appbar replaces old
        - [x] back/menu button
        - [x] move "quizmodal" uses to modal callouts eg "appmenumodal" "helpmodal" etc
        - [x] modals ONLY WORK with deck menu, not working when click outside (in android only), use react-native-modal

    - [x] bugs/improvements
        - [x] need at least 1 test deck loaded for android emulator
        - [x] full list clips at bottom
        - [x] simpler color scheme
            - [ ] ~~note where colors applied~~
            - [ ] ~~more neutral color scheme~~
            - [ ] ~~? user select color scheme~~
        - [x] more spacing between switches
        - [ ] ~~android top bar shaded~~
    -   [x] app icon

    -   [x] very last tasks before beta build
        -   [x] remove all @todos
        -   [x] move all "style"s to stylesheets

- [x] add file help
    - [x] show first time along with loading demo data
    - [x] below "dark theme" in menu to show again

- [x] make beta
    -   [x] android
    -   [x] iphone
    -   [x] beta testing by other ppl (https://docs.expo.dev/review/overview/)
</details>
