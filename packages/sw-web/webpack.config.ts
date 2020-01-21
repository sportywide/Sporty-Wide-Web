import path from 'path';
import { isDevelopment } from '@shared/lib/utils/env';
import { makeConfig } from '@build/webpack/node/config';
import paths from '@build/paths';

const argv = require('yargs').argv;
const findup = require('find-up');

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
	envVars: {
		IS_SERVER: 'true',
		APP_VERSION: require('./package.json').version,
	},
	optimizationOptions: {
		minimize: false,
	},
	envFile: argv.env !== 'production' ? findup.sync('.env') : '.env',
});

module.exports = config;
