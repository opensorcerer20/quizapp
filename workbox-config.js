module.exports = {
	globDirectory: 'dist',
	globPatterns: [
		'**/*.{json,html,ico,png,js}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};