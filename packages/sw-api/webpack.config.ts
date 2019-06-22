import { makeConfig } from 'sportywide-shared/build/webpack/node/config';
import paths from 'sportywide-shared/build/paths';
import path from 'path';

module.exports = makeConfig({
	entries: path.resolve(paths.api.src, 'main'),
	output: paths.api.dist,
	alias: {
		'@shared': paths.shared.src,
		'@schema': paths.schema.src,
		'@core': paths.core.src,
		'@api': paths.api.src,
	},
});
