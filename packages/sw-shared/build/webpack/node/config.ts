import { getDependencies } from '@root/helpers/package';
import { externals, node, target, watch } from '../plugins/core';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { babel } from '../plugins/babel';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import paths from '@build/paths';
import fs from 'fs';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import {
	addPlugins,
	createConfig,
	entryPoint,
	env,
	resolve,
	setEnv,
	setMode,
	setOutput,
	sourceMaps,
} from '@webpack-blocks/webpack';

export function makeConfig({ entries, output, alias }) {
	process.env.NODE_ENV = process.env.NODE_ENV || 'development';
	const isDev = process.env.NODE_ENV === 'development';
	const packageName = path.basename(path.dirname(output));
	const dependencies = [...getDependencies({ packageName, rootDir: paths.project.root }), packageName];

	return createConfig([
		setOutput(output),
		setMode(isDev ? 'development' : 'production'),
		entryPoint(entries),
		target('node'),
		externals(getNodeModules()),
		babel({
			cwd: path.resolve(__dirname, 'babel'),
		}),
		resolve({
			extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],
			alias,
			modules: ['node_modules'],
		}),
		setEnv({
			NODE_ENV: process.env.NODE_ENV,
		}),
		watch(),
		env('development', [addPlugins([new ForkTsCheckerWebpackPlugin()]), sourceMaps('inline-source-map')]),
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
		addPlugins([new CleanWebpackPlugin()]),
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
			modulesDir: dir,
		})
	);
}
