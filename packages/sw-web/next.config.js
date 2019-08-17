const path = require('path');
const paths = require('sportywide-shared/build/paths');
const withPlugins = require('next-compose-plugins');
const babel = require('next-plugin-custom-babel-config');
const bundleAnalyzer = require('@zeit/next-bundle-analyzer');
const css = require('@zeit/next-css');
const scss = require('@zeit/next-sass');

const nextConfig = {
	webpack: config => {
		const oldConfig = config;
		config.resolve = {
			...(oldConfig.resolve || {}),
			alias: {
				...oldConfig.resolve.alias,
				'@shared': 'sportywide-shared/src',
				'@web': `${paths.web.src}/`,
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
