import { makeConfig } from 'sportywide-shared/build/webpack/node/config';
import paths from 'sportywide-shared/build/paths';
import path from 'path';

module.exports = makeConfig({
	entries: path.resolve(paths.email.src, 'main'),
	output: paths.email.dist,
	alias: {
		'@shared': paths.shared.src,
		'@core': paths.core.src,
		'@email': paths.email.src,
	},
});
