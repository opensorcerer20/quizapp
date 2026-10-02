# Text input test cases

## Scope and assumptions

The app is local-first with one user per device. Every deck comes from that user: typed into the Add Question form, or imported from a `.txt` or `.csv` file they picked. Nothing the user enters can reach another user, so HTML sanitization is not needed and is removed. React escapes all rendered text, so markup in a card is shown as typed and never runs.

The goal for this ticket is **fidelity**: what the user typed or imported is what they see, with no mangled characters. The only changes made to input are trimming the ends of each field and normalizing to Unicode NFC.

All other issues that were considered (whitespace and line endings, control and invisible characters, length and count limits, file structure and encoding, deck names, storage robustness, and export round-trips) were judged to be out of scope for changes associated with this ticket.

## Test cases

Every case is checked on each input path listed, then again when stored and when displayed.

- **Text:** `.txt` import, alternating question and answer lines
- **CSV:** `.csv` import, question in column 1 and answer in column 2
- **Manual:** the Add Question form

| ID | Input | Paths | Expected |
|---|---|---|---|
| F-01 | `<b>hola</b>` | Text, CSV, Manual | Stored and displayed as `<b>hola</b>` |
| F-02 | `<script>alert(1)</script>` and `<img src=x onerror=alert(1)>` | Text, CSV, Manual | Displayed as literal text. No element is created and nothing runs |
| F-03 | `x < 5 && y > 2` | Text, CSV, Manual | Kept exactly, not turned into `&lt;` or `&amp;` |
| F-04 | `Tom &amp; Jerry` | Text, CSV, Manual | Kept exactly, not decoded to `&` |
| F-05 | `"quoted"`, `it's`, `` `code` `` | Text, Manual | Quotes, apostrophes and backticks kept. CSV is left out because quotes are CSV syntax |
| F-06 | `café`, `naïve`, `日本語`, `こんにちは`, `مرحبا` | Text, CSV, Manual | Kept and displayed correctly, including right-to-left text |
| F-07 | `👩‍💻`, `🇯🇵`, `👍🏽` | Text, CSV, Manual | Kept as whole characters, with joiners and skin-tone modifiers intact |
| F-08 | `café` typed with a combining accent (NFD) | Text, CSV, Manual | Stored in NFC form, looks the same |
| F-09 | `=SUM(A1:A2)`, `+1`, `-1`, `@user` | Text, CSV, Manual | Kept as typed |
| F-10 | `__proto__`, `constructor`, `toString` | Text, CSV, Manual | Stored as ordinary strings and loaded back unchanged |
| F-11 | `  a    b  ` | Text, CSV, Manual | Stored as `a    b`: ends trimmed, inner spacing kept |

## Where the tests live

The cases are defined once in `src/__fixtures__/fidelityCases.js` and used by:

| File | What it checks |
|---|---|
| `src/components/Deck/__tests__/QuizDeck.test.js` | Text and CSV imports through `getQuestionObjectsFromRawData` |
| `src/app/__tests__/AddQuestion.test.js` | Manual entry: fills the form, submits, and checks what is saved |
| `src/common/__tests__/fileLib.test.js` | Saving and loading return identical strings |
| `src/components/Deck/__tests__/DeckScreenItem.test.js` | The card list shows the text literally, creates no `<b>`, `<script>` or `<img>` element, and never calls `alert` |
| `src/common/__tests__/normalizeText.test.js` | `normalizeText` on its own: every case, plus NFD to NFC, trimming with inner whitespace and line breaks kept, and whitespace-only input |

Run them with `npm run test:unit`.

All cases pass.

## Implementation

1. The HTML sanitization (`sanitizeAll` and the `sanitize-html` dependency) was removed, along with every call to it.
2. `normalizeText` in `src/common/util.js` trims a string and normalizes it to Unicode NFC. It does not escape, encode, decode or remove any other characters.
3. Every question and answer goes through `normalizeText`. Text and CSV imports are covered in `makeQuestionObjects` in `src/components/Deck/QuizDeck.js`, and manual entry in `handleSubmit` in `src/app/AddQuestion.js`. Deck names from imports also go through it.
4. User text is displayed only as plain text, never as HTML. If user text is ever rendered as HTML in the future, sanitization needs to be reconsidered.
