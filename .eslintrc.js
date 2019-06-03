module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended',
	],
	plugins: ['@typescript-eslint', 'react'],
	rules: {
		"@typescript-eslint/no-parameter-properties": 0,
		"@typescript-eslint/explicit-member-accessibility": 0,
		"@typescript-eslint/no-explicit-any": 0,
		"@typescript-eslint/no-use-before-define": 0,
		"@typescript-eslint/interface-name-prefix": 0,
	},
	settings:  {
		react:  {
			version:  'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
		},
	},
};
