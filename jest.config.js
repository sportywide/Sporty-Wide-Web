const baseConfig = require('./jest.config.base');
module.exports = {
	...baseConfig,
	coverageDirectory: './coverage',
	//change this to allow more better coverage testing
	coverageThreshold: {
		global: {
			statements: 0,
			branches: 0,
			functions: 0,
			lines: 0,
		},
	},
	projects: ['<rootDir>/packages/*/jest.config.js'],
};
