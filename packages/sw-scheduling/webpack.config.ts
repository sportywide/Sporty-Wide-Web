import { makeConfig } from '@build/webpack/node/config';
import slsw from 'serverless-webpack';
import paths from '@build/paths';

const isDev = slsw.lib.webpack.isLocal;
process.env.NODE_ENV = isDev ? 'development' : 'production';

const config = makeConfig({
	entries: slsw.lib.entries,
	watchMode: false,
	env: process.env.NODE_ENV,
	libraryTarget: 'commonjs2',
	output: paths.scheduling.dist,
	alias: {
		'@scheduling': paths.scheduling.src,
		'@schema': paths.schema.src,
		'@core': paths.core.src,
		'@data': paths.data.src,
		'@shared': paths.shared.src,
	},
});

(config.optimization = config.optimization || {}).minimize = false;

module.exports = config;
