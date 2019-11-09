import path from 'path';
import { makeConfig } from '@build/webpack/node/config';
import paths from '@build/paths';
const argv = require('yargs').argv;

module.exports = makeConfig({
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
});
