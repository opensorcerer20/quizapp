module.exports = {
	globDirectory: 'dist',
	// ttf matters: every screen's chrome is icon-based (MaterialCommunityIcons,
	// FontAwesome6), and without the fonts cached the app renders tofu offline
	globPatterns: [
		'**/*.{json,html,ico,png,js,ttf}'
	],
	// workbox defaults globIgnores to ['**/node_modules/**/*'], but expo emits
	// bundled assets under dist/assets/node_modules/... - that default silently
	// excluded every icon font. override it, and skip only the generated
	// service worker files so a rebuild doesn't precache the previous worker
	globIgnores: [
		'**/sw.js',
		'**/workbox-*.js'
	],
	swDest: 'dist/sw.js',
	// the expo web bundle is ~3.3MB, over workbox's 2MB default - without this
	// the app's own JS is silently skipped and it cannot boot offline at all.
	// kept bounded so a runaway bundle still trips the warning
	maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
	// web.output is "single", so expo-router serves every route from index.html.
	// offline reloads on /QuizScreen etc have nothing to match without this
	navigateFallback: 'index.html',
	// precache is ~6.4MB per deploy now, so old revisions have to be evicted
	cleanupOutdatedCaches: true,
	// activate the new worker on the first load after a deploy instead of
	// waiting for every tab to close, so returning users pick up the bundle
	// (and run the localStorage -> IndexedDB migration) right away
	skipWaiting: true,
	clientsClaim: true,
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};
