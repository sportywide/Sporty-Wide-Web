module.exports = function(api) {
	api.cache(true);

	return {
		presets: [
			[
				'@babel/preset-env',
				{
					targets: {
						node: true,
					},
					modules: 'commonjs',
				},
			],
			['@babel/typescript'],
		],
		plugins: [
			'babel-plugin-transform-typescript-metadata',
			'@babel/plugin-proposal-optional-chaining',
			'@babel/plugin-proposal-nullish-coalescing-operator',
			['@babel/plugin-proposal-decorators', { legacy: true }],
			['@babel/plugin-proposal-class-properties', { loose: true }],
		],
	};
};
