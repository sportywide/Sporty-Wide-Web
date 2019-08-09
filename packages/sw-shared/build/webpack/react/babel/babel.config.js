module.exports = function(api) {
	api.cache(true);

	return {
		presets: ['next/babel', '@zeit/next-typescript/babel'],
		plugins: [
			'babel-plugin-transform-typescript-metadata',
			['@babel/plugin-proposal-decorators', { legacy: true }],
		],
	};
};
