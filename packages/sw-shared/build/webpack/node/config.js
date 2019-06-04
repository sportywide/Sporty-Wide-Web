const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { target, externals, watch, node } = require('../plugins/core');
const { babel } = require('../plugins/babel');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const paths = require('../../paths');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
	createConfig,
	setEnv,
	addPlugins,
	entryPoint,
	sourceMaps,
	setMode,
	setOutput,
	resolve,
} = require('@webpack-blocks/webpack');

module.exports = function makeConfig({ entries, output, alias }) {
	process.env.NODE_ENV = process.env.NODE_ENV || 'development';
	const isDev = process.env.NODE_ENV === 'development';

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
		setOutput({
			filename: '[name].js',
			path: output,
		}),
		addPlugins([new CleanWebpackPlugin()]),
		addPlugins([
			new CopyWebpackPlugin([
				{
					from: 'config*.js',
					to: output,
					context: path.resolve(path.dirname(output), 'src', 'config'),
				},
			]),
			new CopyWebpackPlugin([
				{
					from: '.env*',
					to: output,
					context: path.resolve(path.dirname(output), 'src', 'config'),
				},
			]),
		]),
		sourceMaps(),
		node(),
	]);
};

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
