import path from 'path';
import { createConfig, resolve, setMode, setOutput } from '@webpack-blocks/webpack';
import webpack from 'webpack';
import * as glob from 'glob';
import {
	setEntry,
	externals,
	target,
	node,
	optimize,
	watch,
	none,
} from './packages/sw-shared/build/webpack/plugins/core';
import { getNodeModules } from './packages/sw-shared/build/webpack/node/config';
import { babelHelper } from './packages/sw-shared/build/webpack/plugins/transpile';
const args = require('yargs').argv;
import paths = require('./packages/sw-shared/build/paths');
const config = createConfig([
	setMode('development'),
	node(),
	babelHelper({
		cwd: path.resolve(paths.shared.webpack, 'node', 'babel'),
		cacheDirectory: true,
	}),
	externals([...getNodeModules()]),
	setOutput({
		libraryTarget: 'commonjs2',
		filename: '[name].js',
		path: paths.project.root,
	}),
	args.watch ? watch() : none(),
	optimize({
		nodeEnv: false,
	}),
	target('node'),
	setEntry(getEntries()),
	resolve({
		extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],
		alias: {
			'@root': paths.project.root,
			'@shared': paths.shared.src,
			'@build': paths.shared.build,
		},
		modules: ['node_modules'],
	}),
]);

function getEntries() {
	const tsFiles = [
		...glob.sync('packages/*/gulpfile.ts', {
			absolute: true,
		}),
		...glob.sync('packages/*/webpack.config.ts', {
			absolute: true,
		}),
	];
	const entries = tsFiles.reduce((map, tsFile) => {
		return {
			...map,
			[path.relative(paths.project.root, tsFile).replace('.ts', '')]: tsFile,
		};
	}, {});
	return {
		gulpfile: path.resolve(paths.project.root, 'gulpfile.ts'),
		...entries,
	};
}

webpack(config, (err: any, stats: any) => {
	if (err) {
		console.error(err.stack || err);
		if (err.details) {
			console.error(err.details);
		}
		return;
	}

	console.info(
		stats.toString({
			chunks: false, // Makes the build much quieter
			colors: true, // Shows colors in the console
		})
	);
});
