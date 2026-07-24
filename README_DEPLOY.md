# Deploying the Web App / PWA

How to build and ship the web package to `https://theotherjeff.site/flashcard_library/`.

For native iOS / Android builds, use EAS — this document covers the web/PWA target only.

---

## TL;DR

```bash
npm run build:web     # export + generate the service worker (order matters)
npm run test:pwa      # boot the real export offline and verify it works
# then upload the entire dist/ directory
```

**Never run `npx expo export` on its own to produce a deploy package.** See below for why.

---

## Why the order matters

`npm run build:web` runs two commands in sequence:

```bash
expo export --platform web && workbox generateSW workbox-config.js
```

`expo export` **deletes the entire contents of `dist/` before writing** (verified — sentinel files
placed in `dist/` do not survive an export). Two consequences:

1. **`workbox generateSW` must run after `expo export`.** Reversed, the export deletes the `sw.js` you
   just generated.
2. **A bare `expo export` leaves `dist/` with no `sw.js` at all.** The app still tries to register
   `/flashcard_library/sw.js`, gets a 404, and
   [`registerServiceWorker.js`](src/common/registerServiceWorker.js) swallows the error into a
   `console.log`. **The site works perfectly — just with no caching and no offline support, and no
   visible symptom.** This is the single most likely way to ship a silently broken PWA.

The upside of the wipe: there is no stale-`sw.js` hazard and no need to clean `dist/` manually.

---

## Full steps

### 1. Bump the version

Update **both** files — they should always match:

- `app.json` → `expo.version`
- `package.json` → `version`

### 2. Run the test suite

```bash
npm test
```

All tests should pass. This runs against the dev server, not the export.

### 3. Build

```bash
npm run build:web
```

### 4. Check the Workbox summary — this is a required gate

The last line of the build output must look like:

```
The service worker will precache 32 URLs, totaling 6.41 MB.
```

| What you see | Meaning |
|---|---|
| ~32 URLs, ~6.4 MB | Correct. Bundle + all four icon fonts + shell are cached. |
| `... won't be precached. Configure maximumFileSizeToCacheInBytes` | **Stop.** The JS bundle exceeded the limit and was skipped — the app cannot boot offline. Raise `maximumFileSizeToCacheInBytes` in [workbox-config.js](workbox-config.js). |
| ~9–10 URLs, ~1–4.4 MB | **Stop.** The icon fonts are missing; the app will render tofu glyphs offline. Check `globPatterns` includes `ttf` **and** that `globIgnores` is still overridden (Workbox's default `['**/node_modules/**/*']` silently excludes Expo's bundled fonts, which live under `dist/assets/node_modules/...`). |

To inspect the manifest directly:

```bash
node -e "const s=require('fs').readFileSync('dist/sw.js','utf8');
const u=[...s.matchAll(/url:\"([^\"]+)\"/g)].map(m=>m[1]);
console.log(u.length,'entries');
console.log(u.filter(x=>/entry-.*\.js$/.test(x)));
console.log(u.filter(x=>x.endsWith('.ttf')));"
```

Expect one `entry-*.js` and four `.ttf` files.

### 5. Verify offline behavior

```bash
npm run test:pwa
```

Serves the real `dist/` on `localhost:8281` under the `/flashcard_library/` base path, registers the
service worker, goes offline, and asserts the app boots with working icon fonts — plus that a non-root
route (`/QuizScreen`) still resolves offline via `navigateFallback`.

This requires a completed `npm run build:web` first. It is intentionally **not** part of `npm test`,
which uses the dev server.

### 6. Upload

Upload the **entire** `dist/` tree, including:

```
sw.js
sw.js.map
workbox-<hash>.js
workbox-<hash>.js.map
index.html
favicon.ico
metadata.json
_expo/
assets/
```

- **`sw.js` must land at `/flashcard_library/sw.js`** — the scope root. A service worker can only
  control its own directory and below, so if it ends up in a subdirectory it controls nothing useful.
- If your upload step filters out `.js` maps or "extra" files, make sure `sw.js` and `workbox-*.js`
  are not among them. Missing either one means no caching at all.

### 7. Confirm in the browser

Load the live site, then DevTools → Application:

- **Service Workers** — a worker is listed as *activated and running*.
- **Cache Storage** — a `workbox-precache-*` cache containing `entry-*.js` and the `.ttf` fonts.
- Tick **Offline**, then reload — the app boots with correct icons.

---

## Server / host configuration

| Path | Header | Why |
|---|---|---|
| `sw.js` | `Cache-Control: no-cache` | Browsers cap service worker script caching at 24h, but an aggressive CDN rule on `*.js` can delay users receiving new deploys well past that. |
| `_expo/static/**`, `assets/**` | long-lived cache is fine | Filenames are content-hashed. |

---

## How updates reach existing users

[workbox-config.js](workbox-config.js) sets `skipWaiting: true` and `clientsClaim: true`, so a new
worker activates on the first load after a deploy rather than waiting for every tab to close.
`cleanupOutdatedCaches: true` evicts the previous revision — without it, ~6.4 MB would accumulate per
deploy.

Because assets are content-hashed, Workbox only refetches entries whose revision actually changed. In
practice that is just the JS bundle; the fonts and images are reused across deploys.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Site works but nothing is cached; DevTools shows no service worker | `dist/sw.js` missing from the upload, or `expo export` was run after `workbox generateSW`. Rebuild with `npm run build:web`. |
| Console: `service worker registration failed` | `sw.js` returned 404 — not deployed, or not at the `/flashcard_library/` root. |
| Blank screen offline | The JS bundle was not precached. Check the Workbox summary for the `won't be precached` warning. |
| Icons render as boxes/tofu offline | The `.ttf` fonts were not precached. Check `globPatterns` and `globIgnores`. |
| Offline reload works at `/` but 404s on `/QuizScreen` | `navigateFallback: 'index.html'` missing from [workbox-config.js](workbox-config.js). `web.output` is `"single"`, so every route is served from `index.html`. |
| Users still on the old version after a deploy | Check that the host isn't long-caching `sw.js`, and that `skipWaiting` / `clientsClaim` are still set. |
| No service worker in local dev | Expected. [`registerServiceWorker.js`](src/common/registerServiceWorker.js) is a no-op unless `NODE_ENV === "production"`, so the worker never fights fast refresh. |
