import path from 'path';
import { isDevelopment } from '@shared/lib/utils/env';
import { makeConfig } from '@build/webpack/node/config';
import paths from '@build/paths';
const argv = require('yargs').argv;

module.exports = makeConfig({
	hot: isDevelopment(argv.env),
	env: argv.env,
	entries: path.resolve(paths.web.src, 'next-server'),
	output: paths.web.dist,
	alias: {
		'@root': paths.project.root,
		'@shared': paths.shared.src,
		'@web': paths.web.src,
		'@web-test': path.resolve(paths.web.root, 'test'),
	},
});
