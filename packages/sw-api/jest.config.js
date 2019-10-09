const baseConfig = require('../../jest.config.base');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/src', '<rootDir>/e2e'],
	displayName: 'sw-api',
	testEnvironment: 'node',
};
