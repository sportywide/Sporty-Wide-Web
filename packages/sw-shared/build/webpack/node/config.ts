import path from 'path';
import fs from 'fs';
import { isDevelopment } from '@shared/lib/utils/env';
import nodeExternals from 'webpack-node-externals';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';
import {
	addPlugins,
	createConfig,
	env,
	resolve,
	setEnv,
	setMode,
	setOutput,
	sourceMaps,
	optimization,
} from '@webpack-blocks/webpack';
import paths from '@build/paths';
import { babelHelper } from '../plugins/transpile';
import { externals, node, none, setEntry, target, watch } from '../plugins/core';

export function makeConfig({
	env: environment = 'development',
	entries,
	libraryTarget,
	output,
	alias,
	hot,
	envFile,
	watchMode,
	optimizationOptions,
}: {
	entries: any;
	output: string;
	alias: any;
	env?: string;
	hot?: boolean;
	envFile?: string;
	watchMode?: boolean;
	libraryTarget?: string;
	optimizationOptions?: any;
}) {
	watchMode = isDevelopment(environment) ? (watchMode === undefined ? true : watchMode) : false;
	const packageName = path.basename(path.dirname(output));

	// @ts-ignore
	process.env.NODE_ENV = environment;

	envFile = envFile
		? path.resolve(paths.project.root, 'packages', packageName, envFile)
		: path.resolve(paths.project.root, 'packages', packageName, '.env');

	return createConfig([
		setOutput(output),
		setMode(isDevelopment(environment) ? 'development' : 'production'),
		setEntry(hot ? ['webpack/hot/poll?1000', entries] : entries),
		target('node'),
		externals([...getNodeModules()]),
		babelHelper({
			cwd: path.resolve(paths.shared.webpack, 'node', 'babel'),
			cacheDirectory: true,
		}),
		resolve({
			extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],
			alias,
			modules: ['node_modules'],
		}),
		setEnv({
			NODE_ENV: environment,
		}),
		env('development', [
			watchMode ? watch() : none(),
			sourceMaps('inline-source-map'),
			hot ? addPlugins([new webpack.HotModuleReplacementPlugin()]) : none(),
		]),
		optimization(optimizationOptions),
		env('production', [sourceMaps('source-map')]),
		addPlugins([
			new webpack.BannerPlugin({
				banner: 'require("source-map-support").install();',
				raw: true,
				entryOnly: false,
			}),
		]),
		setOutput({
			filename: '[name].js',
			path: output,
			libraryTarget,
		}),
		addPlugins(
			[
				fs.existsSync(envFile)
					? new CopyWebpackPlugin(
							[
								{
									from: envFile,
									to: path.resolve(output, '.env'),
									toType: 'file',
								},
							],
							{
								copyUnmodified: true,
							}
					  )
					: null,
				new CopyWebpackPlugin(
					[
						{
							from: {
								glob: '**/*',
								dot: true,
							},
							to: path.resolve(output, 'assets'),
							context: path.resolve(paths.project.root, 'packages', packageName, 'assets'),
						},
					],
					{
						copyUnmodified: true,
					}
				),
			].filter(plugin => plugin)
		),
		node(),
	]);
}

export function getNodeModules() {
	const projectRoot = paths.project.root;
	const packageFolder = path.resolve(projectRoot, 'packages');
	const excludeDirs = ['sw-web'];
	const packageDirs = fs
		.readdirSync(packageFolder)
		.filter(dir => !excludeDirs.includes(dir) && fs.statSync(path.join(packageFolder, dir)).isDirectory())
		.map(dir => path.resolve(packageFolder, dir));

	return [
		path.resolve(projectRoot, 'node_modules'),
		...packageDirs.map(dir => path.resolve(dir, 'node_modules')),
	].map(dir =>
		nodeExternals({
			whitelist: 'webpack/hot/poll?1000',
			modulesDir: dir,
		})
	);
}
