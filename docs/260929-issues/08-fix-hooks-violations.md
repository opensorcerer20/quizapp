title: Fix rules-of-hooks violations in ThemeProvider and getInsetPadding
labels: bug
section: Correctness fixes
---
### Problem

- `src/components/Providers/ThemeProvider.js` (line 39) calls `useColorScheme()` inside a `useEffect`. Hooks must be called at the top level of a component or custom hook.
- `getInsetPadding` in `src/common/util.js` (line 88) calls `useSafeAreaInsets()`, but it is a plain function, not a hook. It only works by accident, depending on where it is called from.

### Fix

- In `ThemeProvider`, call `const systemScheme = useColorScheme();` at the top of the component and use `systemScheme` inside the effect.
- Rename `getInsetPadding` to `useInsetPadding` and make sure it is only called from components or hooks.

### Done when

- [ ] No hooks are called inside effects, callbacks, or non-hook functions
- [ ] `eslint-plugin-react-hooks` reports no `rules-of-hooks` errors (see the ESLint issue)
- [ ] The default theme still follows the system setting when no theme is saved
