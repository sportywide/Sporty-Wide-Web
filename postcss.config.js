module.exports = {
	plugins: [
		require('postcss-preset-env')({ stage: 0 }),
		require('postcss-css-variables')(),
		process.env.NODE_ENV === 'production' ? require('cssnano')({ preset: 'default' }) : null,
	].filter(plugin => plugin),
};
