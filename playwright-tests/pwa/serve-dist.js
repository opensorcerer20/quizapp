/*
 * Minimal static server for the exported PWA, used only by test:pwa.
 *
 * Mirrors the real host closely enough for service worker testing: dist/ is
 * mounted under the app.json experiments.baseUrl prefix, and unknown paths
 * fall back to index.html the way a SPA host would.
 */
const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = 8281;
const BASE_URL = "/flashcard_library";
const DIST = path.join(__dirname, "..", "..", "dist");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ttf": "font/ttf",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".map": "application/json; charset=utf-8",
};

const send = (res, status, body, contentType) => {
  res.writeHead(status, {
    "Content-Type": contentType,
    // never let HTTP caching mask what the service worker is or isn't doing
    "Cache-Control": "no-store",
    // the service worker must be allowed to control the whole baseUrl scope
    "Service-Worker-Allowed": BASE_URL + "/",
  });
  res.end(body);
};

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent(new URL(req.url, `http://localhost:${PORT}`).pathname);

  if (!requestPath.startsWith(BASE_URL)) {
    send(res, 404, "not found", "text/plain; charset=utf-8");
    return;
  }

  let relativePath = requestPath.slice(BASE_URL.length).replace(/^\/+/, "");
  if (relativePath === "") {
    relativePath = "index.html";
  }

  let filePath = path.join(DIST, relativePath);

  // block traversal outside dist
  if (!filePath.startsWith(DIST)) {
    send(res, 403, "forbidden", "text/plain; charset=utf-8");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // SPA fallback, but only for navigations - a missing asset should 404 so
    // test failures point at the real problem instead of serving them HTML
    if (path.extname(relativePath) !== "") {
      send(res, 404, "not found", "text/plain; charset=utf-8");
      return;
    }
    filePath = path.join(DIST, "index.html");
  }

  const contentType = MIME_TYPES[path.extname(filePath)] ?? "application/octet-stream";
  send(res, 200, fs.readFileSync(filePath), contentType);
});

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error(`No export found at ${DIST}. Run "npm run build:web" first.`);
  process.exit(1);
}

server.listen(PORT, () => {
  console.log(`serving dist at http://localhost:${PORT}${BASE_URL}/`);
});
