import path from 'path';
import { isDevelopment } from '@shared/lib/utils/env';
import { makeConfig } from '@build/webpack/node/config';
import paths from '@build/paths';
const argv = require('yargs').argv;

const config = makeConfig({
	hot: isDevelopment(argv.env),
	env: argv.env,
	entries: path.resolve(paths.web.src, 'next-server'),
	output: paths.web.dist,
	alias: {
		'@root': paths.project.root,
		'@shared': paths.shared.src,
		'@web': paths.web.src,
	},
});

(config.optimization = config.optimization || {}).minimize = false;

module.exports = config;
