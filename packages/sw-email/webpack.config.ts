import path from 'path';
import { makeConfig as makeNodeConfig } from 'sportywide-shared/build/webpack/node/config';
import { makeConfig as makeStyleConfig } from 'sportywide-shared/build/webpack/styles/config';
import paths from 'sportywide-shared/build/paths';
import glob from 'glob';

module.exports = [
	makeNodeConfig({
		entries: path.resolve(paths.email.src, 'main'),
		output: paths.email.dist,
		alias: {
			'@shared': paths.shared.src,
			'@core': paths.core.src,
			'@email': paths.email.src,
			'@schema': paths.schema.src,
		},
	}),
	makeStyleConfig({
		entries: getStylesEntries(),
		output: path.resolve(paths.email.dist, 'styles'),
	}),
];

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
