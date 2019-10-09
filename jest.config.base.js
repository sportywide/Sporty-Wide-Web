const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
	roots: ['<rootDir>/src', '<rootDir>/e2e', '<rootDir>/integrations'],
	clearMocks: true,
	preset: 'ts-jest',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	testURL: 'http://localhost',
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: `${__dirname}/` }),
	collectCoverageFrom: [
		'**/src/**/*.ts',
		'**/src/**/*.tsx',
		'!**/__tests__/**',
		'!**/test/**',
		'!**/node_modules/**',
	],
	globals: {
		'ts-jest': {
			diagnostics: false,
		},
	},
};
