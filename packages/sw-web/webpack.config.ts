import path from 'path';
import { makeConfig } from '@build/webpack/node/config';
import paths from '@build/paths';
import { isDevelopment } from '@shared/lib/utils/env';
//@ts-ignore
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = makeConfig({
	hot: isDevelopment(),
	entries: path.resolve(paths.web.src, 'next-server'),
	output: paths.web.dist,
	alias: {
		'@root': paths.project.root,
		'@shared': paths.shared.src,
		'@web': paths.web.src,
		'@web-test': path.resolve(paths.web.root, 'test'),
	},
});
