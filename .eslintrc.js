module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended',
		'plugin:react/recommended',
	],
	plugins: ['@typescript-eslint'],
	rules: {
		'@typescript-eslint/no-parameter-properties': 0,
		'@typescript-eslint/explicit-member-accessibility': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/no-var-requires': 0,
		'@typescript-eslint/no-use-before-define': 0,
		'@typescript-eslint/interface-name-prefix': 0,
		'@typescript-eslint/explicit-function-return-type': 0,
		'no-undef': 'error',
	},
	env: {
		node: true,
		es6: true,
	},
};
