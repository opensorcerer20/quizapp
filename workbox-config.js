module.exports = {
	globDirectory: 'dist',
	globPatterns: [
		'**/*.{json,html,ico,png,js}'
	],
	swDest: 'dist/sw.js',
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