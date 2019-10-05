import path from 'path';
import { makeConfig } from 'sportywide-shared/build/webpack/node/config';
import paths from 'sportywide-shared/build/paths';
import glob = require('glob');
const findup = require('find-up');

//@ts-ignore
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
module.exports = makeConfig({
	entries: getEntries(),
	output: paths.data.dist,
	watchMode: false,
	alias: {
		'@root': paths.project.root,
		'@shared': paths.shared.src,
		'@schema': paths.schema.src,
		'@data': paths.data.src,
		'@core': paths.core.src,
	},
	envFile: findup.sync('.env'),
});

function getEntries() {
	if (process.env.npm_config_script) {
		const entryName = process.env.npm_config_script.replace(/\.(js|ts)x?$/, '');
		return {
			[entryName]: path.resolve(paths.data.scripts, process.env.npm_config_script),
		};
	} else {
		return glob
			.sync('**/*.ts', {
				absolute: true,
				cwd: paths.data.scripts,
			})
			.reduce((currentMap, entry) => {
				const entryName = path.relative(paths.data.scripts, entry).replace(/\.(js|ts)x?$/, '');
				return {
					...currentMap,
					[entryName]: entry,
				};
			}, {});
	}
}
