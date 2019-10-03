import path from 'path';
import { makeConfig } from 'sportywide-shared/build/webpack/node/config';
import paths from 'sportywide-shared/build/paths';
//@ts-ignore
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = makeConfig({
	entries: path.resolve(paths.api.src, 'main'),
	output: paths.api.dist,
	hot: true,
	alias: {
		'@root': paths.project.root,
		'@shared': paths.shared.src,
		'@schema': paths.schema.src,
		'@core': paths.core.src,
		'@api': paths.api.src,
	},
});
