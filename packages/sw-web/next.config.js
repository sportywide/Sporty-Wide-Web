const path = require('path');
const paths = require('sportywide-shared/build/paths');
const withPlugins = require('next-compose-plugins');
const babel = require('next-plugin-custom-babel-config');
const bundleAnalyzer = require('@zeit/next-bundle-analyzer');
const css = require('@zeit/next-css');
const scss = require('@zeit/next-sass');
const webpack = require('webpack');
const { importAutoDllPlugin } = require('next/dist/build/webpack/plugins/dll-import');
const { ENTRY_ORDER, default: InjectPlugin } = require('webpack-inject-plugin');
const nextConfig = {
	webpack: (webpackConfig, options) => {
		const { dir, config: nextConfig } = options;
		const distDir = path.resolve(dir, nextConfig.distDir);
		webpackConfig.resolve = {
			...(webpackConfig.resolve || {}),
			alias: {
				...webpackConfig.resolve.alias,
				'@shared': paths.shared.src,
				'@web': paths.web.src,
				'@web-test': path.resolve(paths.web.root, 'test'),
			},
		};
		webpackConfig.module.rules.push({
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

		webpackConfig.module.rules.push({
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

		webpackConfig.plugins = webpackConfig.plugins.map(plugin => {
			if (plugin.constructor.name !== 'AutoDLLPlugin') {
				return plugin;
			}
			const AutoDllPlugin = importAutoDllPlugin({ distDir });

			return new AutoDllPlugin({
				filename: '[name]_[hash].js',
				path: './static/development/dll',
				context: dir,
				entry: {
					redux: ['redux', 'redux-thunk', 'redux-observable', 'redux-devtools-extension', 'react-redux'],
					utility: [
						'rxjs',
						'axios',
						'axios-observable',
						'typesafe-actions',
						'typedi',
						'recompose',
						'lodash',
						'formik',
						'date-fns',
						'yup',
						'yup-decorator',
						'hoist-non-react-statics',
						'crypto-browserify',
					],
					ui: [
						'react',
						'react-dnd',
						'react-dnd-html5-backend',
						'react-dom',
						'react-measure',
						'semantic-ui-react',
						'styled-components',
						'react-notification-system',
						'react-notification-system-redux',
						'react-redux-loading-bar',
						'semantic-ui-calendar-react',
					],
				},
				config: {
					devtool: webpackConfig.devtool,
					mode: webpackConfig.mode,
					resolve: webpackConfig.resolve,
				},
			});
		});

		webpackConfig.module.rules.push({
			test: /@nestjs/,
			use: 'null-loader',
		});

		webpackConfig.plugins.push(
			new InjectPlugin(() => 'require("reflect-metadata")', {
				entryOrder: ENTRY_ORDER.First,
			})
		);

		webpackConfig.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

		return webpackConfig;
	},
	webpackDevMiddleware: config => {
		config.watchOptions = {
			...(config.watchOptions || {}),
			poll: 1000, // Check for changes every second
			aggregateTimeout: 300, // delay before rebuilding
		};
		config.noInfo = false;
		config.logLevel = 'info';
		config.stats = {
			assets: false,
			modules: false,
			cachedAssets: false,
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
