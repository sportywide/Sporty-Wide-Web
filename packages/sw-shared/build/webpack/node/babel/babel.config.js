module.exports = function(api) {
	api.cache(true);

	return {
		presets: [
			[
				'@babel/preset-env',
				{
					targets: {
						node: '10.16',
					},
				},
			],
			['@babel/typescript'],
		],
		plugins: [
			'babel-plugin-transform-typescript-metadata',
			['@babel/plugin-proposal-decorators', { legacy: true }],
			['@babel/plugin-proposal-class-properties', { loose: true }],
		],
	};
};
