module.exports = function(api) {
	api.cache(true);

	return {
		presets: ['next/babel'],
		plugins: [
			'babel-plugin-transform-typescript-metadata',
			'@babel/plugin-proposal-optional-chaining',
			'@babel/plugin-proposal-nullish-coalescing-operator',
			['@babel/plugin-proposal-decorators', { legacy: true }],
			['@babel/plugin-proposal-class-properties', { loose: true }],
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
