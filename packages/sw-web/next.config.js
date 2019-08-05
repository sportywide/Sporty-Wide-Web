const path = require('path');
const paths = require('sportywide-shared/build/paths');
const withCustomBabelConfigFile = require('next-plugin-custom-babel-config');

module.exports = withCustomBabelConfigFile({
	babelConfigFile: path.resolve(paths.shared.webpack, 'react', 'babel', 'babel.config.js'),
	webpack: config => {
		const oldConfig = config;
		config.resolve = {
			...(oldConfig.resolve || {}),
			alias: {
				...oldConfig.resolve.alias,
				'@shared': 'sportywide-shared/src',
				'@web': paths.web.src + '/',
			},
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
	dest: 'dist',
	dir: 'src',
});
