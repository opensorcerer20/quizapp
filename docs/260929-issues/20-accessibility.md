title: Accessibility pass
labels: accessibility
section: Web quality
---
### Problem

`src/` has no `accessibilityLabel`, `accessibilityRole`, or `aria-*` attributes. Several controls are icon-only (menu, theme toggle, help, download, flip arrow, deck settings), so screen readers have nothing meaningful to announce.

### Fix

- Add `accessibilityRole` and `accessibilityLabel` to every icon button and pressable card. react-native-web turns these into `role` and `aria-label` in the browser.
- Make the flip card announce which side it is showing, and that it can be flipped.
- Check keyboard navigation on web: tab order, visible focus, Enter and Space activate controls, Escape closes modals.
- Check color contrast in both themes. The light theme's lavender buttons with black text, and the dark theme's gray disabled text, need checking.
- Add `@axe-core/playwright` checks to the end-to-end tests.

### Done when

- [ ] Lighthouse accessibility score is 95 or higher on the main screens
- [ ] axe reports no serious or critical violations in CI
- [ ] The app can be used end to end with a keyboard only
