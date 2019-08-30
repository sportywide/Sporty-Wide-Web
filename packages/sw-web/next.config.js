const path = require('path');
const webpack = require('webpack');
const paths = require('sportywide-shared/build/paths');
const withPlugins = require('next-compose-plugins');
const babel = require('next-plugin-custom-babel-config');
const bundleAnalyzer = require('@zeit/next-bundle-analyzer');
const css = require('@zeit/next-css');
const scss = require('@zeit/next-sass');
const { ENTRY_ORDER, default: InjectPlugin } = require('webpack-inject-plugin');

const nextConfig = {
	webpack: (config, options) => {
		const { dir } = options;
		const oldConfig = config;
		config.resolve = {
			...(oldConfig.resolve || {}),
			alias: {
				...oldConfig.resolve.alias,
				'@shared': paths.shared.src,
				'@web': paths.web.src,
				'@web-test': path.resolve(paths.web.root, 'test'),
			},
		};
		config.module.rules.push({
			test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
			use: {
				loader: 'url-loader',
				options: {
					limit: 8192,
					publicPath: '/_next/static/',
					outputPath: 'static/',
					name: '[name].[ext]',
				},
			},
		});

		config.module.rules.push({
			test: /\.(ts|tsx)$/,
			exclude: [/node_modules/, dir],
			use: {
				loader: 'babel-loader',
				options: {
					cwd: path.resolve(paths.shared.webpack, 'react', 'babel'),
					cacheDirectory: true,
				},
			},
		});

		config.module.rules.push({
			test: /@nestjs/,
			use: 'null-loader',
		});

		config.plugins.push(
			new InjectPlugin(() => 'require("reflect-metadata")', {
				entryOrder: ENTRY_ORDER.First,
			})
		);

		config.node = {
			fs: 'empty',
		};

		return config;
	},
	webpackDevMiddleware: config => {
		config.watchOptions = {
			poll: 1000, // Check for changes every second
			aggregateTimeout: 300, // delay before rebuilding
		};
		return config;
	},
	distDir: path.join('..', 'next-build'),
	dir: paths.web.src,
	onDemandEntries: {
		// period (in ms) where the server will keep pages in the buffer
		maxInactiveAge: 250 * 1000,
		// number of pages that should be kept simultaneously without being disposed
		pagesBufferLength: 10,
	},
};

module.exports = withPlugins(
	[
		[
			bundleAnalyzer,
			{
				analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
				analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
				bundleAnalyzerConfig: {
					server: {
						analyzerMode: 'static',
						reportFilename: './bundle-analyze/server.html',
					},
					browser: {
						analyzerMode: 'static',
						reportFilename: './bundle-analyze/client.html',
					},
				},
			},
		],
		[
			babel,
			{
				babelConfigFile: path.resolve(paths.shared.webpack, 'react', 'babel', 'babel.config.js'),
			},
		],
		scss,
		css,
	],
	nextConfig
);
