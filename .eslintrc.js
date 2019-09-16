module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'plugin:@typescript-eslint/recommended',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended',
		'plugin:react/recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
	],
	plugins: ['@typescript-eslint', 'react-hooks'],
	rules: {
		'@typescript-eslint/no-parameter-properties': 0,
		'@typescript-eslint/explicit-member-accessibility': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/no-var-requires': 0,
		'@typescript-eslint/no-use-before-define': 0,
		'@typescript-eslint/interface-name-prefix': 0,
		'@typescript-eslint/explicit-function-return-type': 0,
		'@typescript-eslint/ban-ts-ignore': 0,
		'@typescript-eslint/no-non-null-assertion': 0,
		'no-undef': 'error',
		'import/dynamic-import-chunkname': 'warn',
		'import/order': 'warn',
		'import/no-unresolved': 0,
		'react/prop-types': 0,
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
	},
	globals: {
		google: true,
	},
	env: {
		node: true,
		es6: true,
		jest: true,
	},
	overrides: [
		{
			files: ['packages/**/*.{js,ts,jsx,ts}'],
			rules: {
				'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
			},
		},
	],
};
