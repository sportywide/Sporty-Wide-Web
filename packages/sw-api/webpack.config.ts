import path from 'path';
import { makeConfig } from '@build/webpack/node/config';
import paths from '@build/paths';
const argv = require('yargs').argv;
const findup = require('find-up');

const config = makeConfig({
	env: argv.env,
	entries: path.resolve(paths.api.src, 'main'),
	output: paths.api.dist,
	alias: {
		'@root': paths.project.root,
		'@shared': paths.shared.src,
		'@schema': paths.schema.src,
		'@core': paths.core.src,
		'@api': paths.api.src,
	},
	envVars: {
		'process.env.APP_VERSION': JSON.stringify(require('./package.json').version),
	},
	optimizationOptions: {
		minimize: false,
	},
	envFile: argv.env !== 'production' ? findup.sync('.env') : '.env',
});

module.exports = config;
