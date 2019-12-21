import path from 'path';
import { makeConfig as makeNodeConfig } from '@build/webpack/node/config';
import { makeConfig as makeStyleConfig } from '@build/webpack/styles/config';
import paths from '@build/paths';
import glob from 'glob';
const argv = require('yargs').argv;

const nodeConfig = makeNodeConfig({
	entries: path.resolve(paths.email.src, 'main'),
	output: paths.email.dist,
	env: argv.env,
	alias: {
		'@root': paths.project.root,
		'@shared': paths.shared.src,
		'@core': paths.core.src,
		'@email': paths.email.src,
		'@schema': paths.schema.src,
	},
	optimizationOptions: {
		minimize: false,
	},
	envFile: argv.env !== 'production' ? '.env.dev' : '.env',
});
const styleConfig = makeStyleConfig({
	env: argv.env,
	entries: getStylesEntries(),
	output: path.resolve(paths.email.dist, 'styles'),
});

module.exports = [nodeConfig, styleConfig];

function getStylesEntries() {
	return glob.sync(path.resolve(paths.email.styles, 'entries', '**/*.scss')).reduce((currentEntries, entry) => {
		const relPath = path
			.relative(path.resolve(paths.email.styles, 'entries'), entry)
			.split(path.sep)
			.join('.');
		const entryName = relPath.replace(/\.s[ca]ss$/, '');
		return {
			...currentEntries,
			[entryName]: entry,
		};
	}, {});
}
