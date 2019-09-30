const cssLoaderConfig = require('./css-loader');

//adapt from @zeit/next-css
module.exports = (nextConfig = {}) => {
	return Object.assign({}, nextConfig, {
		webpack(config, options) {
			if (!options.defaultLoaders) {
				throw new Error(
					'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
				);
			}

			const { dev, isServer } = options;
			const { cssModules, cssLoaderOptions, postcssLoaderOptions } = nextConfig;

			options.defaultLoaders.css = cssLoaderConfig(config, {
				extensions: ['css'],
				cssModules,
				cssLoaderOptions,
				postcssLoaderOptions,
				dev,
				usePostCss: true,
				isServer,
			});

			config.module.rules.push({
				test: /\.css$/,
				exclude: /node_modules/,
				use: options.defaultLoaders.css,
			});

			const nodeModulesLoader = cssLoaderConfig(config, {
				extensions: ['css'],
				cssModules,
				cssLoaderOptions,
				dev,
				usePostCss: false,
				isServer,
			});

			config.module.rules.push({
				test: /\.css$/,
				include: /node_modules/,
				use: nodeModulesLoader,
			});

			if (typeof nextConfig.webpack === 'function') {
				return nextConfig.webpack(config, options);
			}

			return config;
		},
	});
};
