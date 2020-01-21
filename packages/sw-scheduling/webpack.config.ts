import path from 'path';
import { makeConfig } from '@build/webpack/node/config';
import slsw from 'serverless-webpack';
import paths from '@build/paths';
import { GenerateDependencyPackages } from '@build/webpack/plugins/generate-package-json';
import { mergePackageJson } from '@root/helpers/package';

const isDev = slsw.lib.webpack.isLocal;
// @ts-ignore
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
	optimizationOptions: {
		minimize: false,
	},
});

config.plugins.push(
	new GenerateDependencyPackages({
		excludes: ['aws-sdk'],
		includes: ['pg', 'source-map-support', 'rxjs', 'graphql', 'yup'],
		packageJson: mergePackageJson({
			rootDir: paths.project.root,
		}),
		outputPath: path.resolve(paths.scheduling.root, 'compile', 'package.json'),
	})
);

module.exports = config;
