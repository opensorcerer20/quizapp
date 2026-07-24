import { Platform } from "react-native";

/*
 * Registers the Workbox service worker produced by "npm run build:web".
 *
 * Expo's web export writes dist/sw.js but never references it from index.html,
 * so nothing was ever registered and the precache was inert - the installed
 * PWA had no offline capability at all.
 *
 * Skipped in development: the dev server doesn't serve sw.js, and a worker
 * caching the bundle would fight fast refresh.
 */
export const registerServiceWorker = () => {
  if (Platform.OS !== "web") return;
  if (process.env.NODE_ENV !== "production") return;
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

  // built from experiments.baseUrl so the worker's scope covers the whole app,
  // rather than resolving relative to whatever route was loaded first
  const baseUrl = process.env.EXPO_BASE_URL || "/";
  const swUrl = `${baseUrl.replace(/\/+$/, "")}/sw.js`;

  navigator.serviceWorker.register(swUrl).catch((error) => {
    console.log("service worker registration failed: " + (error?.message ?? error));
  });
};
