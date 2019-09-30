const cssLoaderConfig = require('./css-loader');

//adapt from @zeit/next-sass
module.exports = (nextConfig = {}) => {
	return Object.assign({}, nextConfig, {
		webpack(config, options) {
			if (!options.defaultLoaders) {
				throw new Error(
					'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
				);
			}

			const { dev, isServer } = options;
			const { cssModules, cssLoaderOptions, postcssLoaderOptions, sassLoaderOptions = {} } = nextConfig;

			options.defaultLoaders.sass = cssLoaderConfig(config, {
				extensions: ['scss', 'sass'],
				cssModules,
				cssLoaderOptions,
				postcssLoaderOptions,
				dev,
				isServer,
				usePostCss: true,
				loaders: [
					{
						loader: 'sass-loader',
						options: sassLoaderOptions,
					},
				],
			});

			config.module.rules.push(
				{
					test: /\.scss$/,
					exclude: /node_modules/,
					use: options.defaultLoaders.sass,
				},
				{
					test: /\.sass$/,
					exclude: /node_modules/,
					use: options.defaultLoaders.sass,
				}
			);

			if (typeof nextConfig.webpack === 'function') {
				return nextConfig.webpack(config, options);
			}

			return config;
		},
	});
};
