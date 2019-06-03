const { target, externals, watch } = require('../plugins/core');
const { babel } = require('../plugins/babel');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const paths = require('../../paths');

const {
	createConfig,
	setEnv,
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
		externals([
			nodeExternals({ modulesDir: paths.project.node_modules }),
			nodeExternals({ modulesDir: paths.api.node_modules }),
			nodeExternals({ modulesDir: paths.shared.node_modules }),
			nodeExternals({ modulesDir: paths.schema.node_modules }),
		]),
		babel({
			cwd: path.resolve(__dirname, 'babel'),
		}),
		resolve({
			extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],
			alias,
			modules: [
				"node_modules"
			],
		}),
		setEnv({
			NODE_ENV: process.env.NODE_ENV,
		}),
		watch(),
		setOutput({
			filename: '[name].js',
			path: output,
		}),
		sourceMaps(),
	])
};
