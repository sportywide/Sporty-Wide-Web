import { makeConfig } from 'sportywide-shared/build/webpack/node/config';
import paths from 'sportywide-shared/build/paths';
import path from 'path';

module.exports = makeConfig({
	entries: path.resolve(paths.api.src, 'main'),
	output: paths.api.dist,
	alias: {
		'@shared': 'sportywide-shared/src',
		'@schema': 'sportywide-schema/src',
		'@api': path.resolve(__dirname, 'src'),
	},
});
