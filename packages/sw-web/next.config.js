const path = require('path');
const paths = require('sportywide-shared/build/paths');
const withPlugins = require('next-compose-plugins');
const babel = require('next-plugin-custom-babel-config');
const bundleAnalyzer = require('@zeit/next-bundle-analyzer');
const webpack = require('webpack');
const { importAutoDllPlugin } = require('next/dist/build/webpack/plugins/dll-import');
const withSourceMaps = require('@zeit/next-source-maps');
const scss = require('./src/build/plugins/with-sass');
const css = require('./src/build/plugins/with-css');

process.env.WEB = 1;

const nextConfig = {
	webpack: (webpackConfig, options) => {
		const { dir, config: nextConfig, isServer } = options;
		const distDir = path.resolve(dir, nextConfig.distDir);
		webpackConfig.resolve = {
			...(webpackConfig.resolve || {}),
			alias: {
				...webpackConfig.resolve.alias,
				'@shared': paths.shared.src,
				'@web': paths.web.src,
			},
		};
		webpackConfig.module.rules.push({
			test: /\.svg$/,
			include: path.resolve('src', 'shared', 'lib', 'icon', 'images'),
			use: [
				'babel-loader',
				{
					loader: 'react-svg-loader',
					options: {
						svgo: {
							plugins: [{ removeTitle: false }],
							floatPrecision: 2,
						},
					},
				},
			],
		});
		webpackConfig.module.rules.push({
			test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
			exclude: path.resolve('src', 'shared', 'lib', 'icon', 'images'),
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

		webpackConfig.plugins.push(
			new webpack.DefinePlugin({
				'process.env.IS_SERVER': JSON.stringify(isServer),
				'process.env.APP_VERSION': JSON.stringify(require('./package.json').version),
			})
		);

		webpackConfig.plugins.push(
			new webpack.NormalModuleReplacementPlugin(/(.*)@web\/shared\/lib\/logging/, function(resource) {
				resource.request = resource.request + (isServer ? '/server' : '/client');
			})
		);

		webpackConfig.output.pathinfo = false;

		const originalEntry = webpackConfig.entry;
		webpackConfig.entry = async () => {
			let entries = await originalEntry();

			if (isServer) {
				entries = injectPolyfill(entries, paths.web.serverPolyfill);
			} else {
				entries['main.js'] = injectPolyfill(entries['main.js'], paths.web.clientPolyfill);
			}
			return entries;
		};

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
						'apollo-boost',
						'graphql',
					],
					react: [
						'@apollo/react-hooks',
						'react',
						'react-dnd-cjs',
						'react-dnd-html5-backend-cjs',
						'react-dom',
						'react-measure',
						'semantic-ui-react',
						'styled-components',
						'react-notification-system',
						'react-notification-system-redux',
						'react-redux-loading-bar',
						'semantic-ui-react-calendar',
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
			test: /(@nestjs|type-graphql)/,
			use: 'null-loader',
		});

		webpackConfig.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

		return webpackConfig;
	},
	webpackDevMiddleware: config => {
		config.watchOptions = {
			...(config.watchOptions || {}),
			watchOptions: {
				ignored: /node_modules/,
			},
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
	typescript: {
		ignoreDevErrors: true,
	},
	distDir: path.join('..', 'next-build'),
	dir: paths.web.src,
	onDemandEntries: {
		// period (in ms) where the server will keep pages in the buffer
		maxInactiveAge: 250 * 1000,
		// number of pages that should be kept simultaneously without being disposed
		pagesBufferLength: 10,
	},
	experimental: { publicDirectory: true },
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
		withSourceMaps,
	],
	nextConfig
);

function injectPolyfill(entry, polyfillFile) {
	if (!entry) {
		return entry;
	}
	if (typeof entry === 'string') {
		return [polyfillFile, entry];
	}
	if (Array.isArray(entry) && !entry.includes(polyfillFile)) {
		return [polyfillFile, ...entry];
	}

	if (typeof entry === 'object') {
		return Object.keys(entry).reduce((currentMap, entryName) => {
			return {
				...currentMap,
				[entryName]: injectPolyfill(entry[entryName], polyfillFile),
			};
		}, {});
	}
	return entry;
}
