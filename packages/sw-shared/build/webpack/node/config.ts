import path from 'path';
import fs from 'fs';
import nodeExternals from 'webpack-node-externals';
import paths from '@build/paths';
import { getDependencies } from '@root/helpers/package';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { isDevelopment } from '@shared/lib/utils/env';
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
import { babelHelper } from '../plugins/transpile';
import { externals, node, target, watch } from '../plugins/core';

export function makeConfig({
	entries,
	output,
	alias,
	tsconfig,
}: {
	entries: any;
	output: string;
	alias: any;
	tsconfig?: string;
}) {
	// @ts-ignore
	process.env.NODE_ENV = process.env.NODE_ENV || 'development';
	const packageName = path.basename(path.dirname(output));
	const dependencies = [...getDependencies({ packageName, rootDir: paths.project.root }), packageName];

	return createConfig([
		setOutput(output),
		setMode(isDevelopment() ? 'development' : 'production'),
		entryPoint(entries),
		target('node'),
		externals(getNodeModules()),
		babelHelper({
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
		env('development', [
			addPlugins([
				new ForkTsCheckerWebpackPlugin({
					tsconfig,
				}),
			]),
			watch(),
			sourceMaps('inline-source-map'),
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
			modulesDir: dir,
		})
	);
}
