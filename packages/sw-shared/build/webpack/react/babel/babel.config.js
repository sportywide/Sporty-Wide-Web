module.exports = function(api) {
	api.cache(true);

	return {
		presets: ['next/babel'],
		plugins: [
			'babel-plugin-transform-typescript-metadata',
			['@babel/plugin-proposal-decorators', { legacy: true }],
			[
				'styled-components',
				{
					ssr: true,
					displayName: true,
					preprocess: false,
				},
			],
		],
	};
};
