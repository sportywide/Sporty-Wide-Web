const makeConfig = require('sportywide-shared/build/webpack/node/config');
const paths = require('sportywide-shared/build/paths');
const path = require('path');

module.exports = makeConfig({
	entries: path.resolve(paths.api.src, 'main'),
	output: paths.api.dist,
	dependencies: ['sw-schema', 'sw-shared'],
	alias: {
		'@shared': 'sportywide-shared/src',
		'@schema': 'sportywide-schema/src',
		'@api': path.resolve(__dirname, 'src'),
	},
});
