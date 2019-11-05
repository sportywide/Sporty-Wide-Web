import { makeConfig } from '@build/webpack/node/config';
import slsw from 'serverless-webpack';
import paths from '@build/paths';

const isDev = slsw.lib.webpack.isLocal;
process.env.NODE_ENV = isDev ? 'development' : 'production';

module.exports = makeConfig({
	entries: slsw.lib.entries,
	env: process.env.NODE_ENV,
	libraryTarget: 'commonjs2',
	output: paths.scheduling.dist,
	alias: {
		'@scheduling': paths.scheduling.src,
		'@shared': paths.shared.src,
	},
});
