const path = require('path');
const paths = require('sportywide-shared/build/paths');
const withTypeScript = require('@zeit/next-typescript');
const withCustomBabelConfigFile = require('next-plugin-custom-babel-config');

module.exports = withCustomBabelConfigFile(
	withTypeScript({
		babelConfigFile: path.resolve(paths.shared.webpack, 'react', 'babel', 'babel.config.js'),
	})
);
