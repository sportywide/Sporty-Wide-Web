import path from 'path';
import fs from 'fs';
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
} from '@webpack-blocks/webpack';
import { getDependencies } from '@root/helpers/package';
import { isDevelopment } from '@shared/lib/utils/env';
import paths from '@build/paths';
import { babelHelper } from '../plugins/transpile';
import { externals, node, none, setEntry, target, watch } from '../plugins/core';

export function makeConfig({
	entries,
	output,
	alias,
	hot,
}: {
	entries: any;
	output: string;
	alias: any;
	hot?: boolean;
}) {
	// @ts-ignore
	process.env.NODE_ENV = process.env.NODE_ENV || 'development';
	const packageName = path.basename(path.dirname(output));
	const dependencies = [...getDependencies({ packageName, rootDir: paths.project.root }), packageName];

	return createConfig([
		setOutput(output),
		setMode(isDevelopment() ? 'development' : 'production'),
		setEntry(hot ? ['webpack/hot/poll?1000', entries] : entries),
		target('node'),
		externals([...getNodeModules()]),
		babelHelper({
			cwd: path.resolve(__dirname, 'babel'),
			cacheDirectory: true,
		}),
		resolve({
			extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],
			alias,
			modules: ['node_modules'],
		}),
		setEnv({
			NODE_ENV: process.env.NODE_ENV,
		}),
		env('development', [
			watch(),
			sourceMaps('inline-source-map'),
			hot ? addPlugins([new webpack.HotModuleReplacementPlugin()]) : none(),
		]),
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
		}),
		addPlugins(
			[].concat(
				//@ts-ignore
				...dependencies.map(dependency => [
					new CopyWebpackPlugin(
						[
							{
								from: {
									glob: '**/*',
									dot: true,
								},
								to: path.resolve(output, dependency, 'config'),
								context: path.resolve(paths.project.root, 'packages', dependency, 'config'),
							},
						],
						{
							copyUnmodified: true,
						}
					),
					new CopyWebpackPlugin(
						[
							{
								from: {
									glob: '**/*',
									dot: true,
								},
								to: path.resolve(output, dependency, 'assets'),
								context: path.resolve(paths.project.root, 'packages', dependency, 'assets'),
							},
						],
						{
							copyUnmodified: true,
						}
					),
				])
			)
		),
		node(),
	]);
}

function getNodeModules() {
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
