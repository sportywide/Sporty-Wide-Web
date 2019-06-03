module.exports = {
	extends: '../../.eslintrc.js',
	env: {
		browser: true,
	},
	plugins: ['react'],
	settings: {
		react: {
			version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
		},
	},
};
