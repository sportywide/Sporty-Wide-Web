import path from 'path';
import { makeConfig } from 'sportywide-shared/build/webpack/node/config';
import paths from 'sportywide-shared/build/paths';

module.exports = makeConfig({
	hot: true,
	entries: path.resolve(paths.web.src, 'next-server'),
	output: paths.web.dist,
	alias: {
		'@shared': paths.shared.src,
		'@web': paths.web.src,
		'@web-test': path.resolve(paths.web.root, 'test'),
	},
});
