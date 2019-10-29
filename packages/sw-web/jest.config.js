const baseConfig = require('../../jest.config.base');

module.exports = {
	...baseConfig,
	displayName: 'sw-web',
	setupFilesAfterEnv: [require.resolve('./src/test/setup-test-framework.ts')],
	moduleNameMapper: {
		...baseConfig.moduleNameMapper,
		'\\.svg$': '<rootDir>/src/test/svg-file-mock.js',
		'\\.s?(c|a)ss$': 'identity-obj-proxy',
	},
};
