const baseConfig = require('../../jest.config.base');

module.exports = {
	...baseConfig,
	displayName: 'sw-web',
	setupFilesAfterEnv: [require.resolve('./test/setup-test-framework.js')],
	moduleNameMapper: {
		...baseConfig.moduleNameMapper,
		'\\.svg$': '<rootDir>/test/svg-file-mock.js',
		'\\.s?(c|a)ss$': 'identity-obj-proxy',
	},
};
