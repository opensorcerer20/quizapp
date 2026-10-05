title: Responsive layout for tablet and desktop browsers
labels: feature, web
section: Web quality
---
### Problem

On a wide screen, `_layout.jsx` renders the whole app inside a fixed-size, phone-shaped frame. For a web app this looks like an emulator rather than a responsive site, and it wastes most of the screen.

### Fix

- Replace the phone frame with a responsive layout: a centered column with a sensible maximum width for reading, and a wider layout where it helps.
- Use `useWindowDimensions` instead of values captured once at startup (`SCREEN_WIDTH` and `SCREEN_HEIGHT` in `constants.js`), so the layout updates when the window is resized.
- Optional: the tablet layout from the roadmap, with several cards visible at once in the deck screen.

### Done when

- [ ] The app looks intentional at 375px, 768px, and 1280px or wider
- [ ] Resizing the browser window updates the layout without a reload
- [ ] Playwright covers at least one mobile and one desktop viewport
