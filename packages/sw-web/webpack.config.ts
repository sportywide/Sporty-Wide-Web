import path from 'path';
import { makeConfig } from 'sportywide-shared/build/webpack/node/config';
import paths from 'sportywide-shared/build/paths';

module.exports = makeConfig({
	entries: path.resolve(paths.web.src, 'next-server'),
	output: paths.web.dist,
	tsconfig: path.resolve(paths.web.src, 'tsconfig.json'),
	alias: {
		'@shared': paths.shared.src,
		'@web': paths.web.src,
	},
});
