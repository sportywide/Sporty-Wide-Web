const nconf = require('nconf');
const JsFormat = require('nconf-js').default;
nconf.formats.js = new JsFormat();
const path = require('path');

exports.getConfigProvider = getConfigProvider;
exports.readConfig = readConfig;

function getConfigProvider() {
	const provider = new nconf.Provider();
	provider.key = nconf.key;
	provider.path = nconf.path;
	provider.loadFiles = nconf.loadFiles;
	provider.loadFilesSync = nconf.loadFilesSync;
	provider.formats = nconf.formats;
	provider.argv().env({
		lowerCase: true,
		parseValues: true,
		separator: '__',
	});

	return provider;
}

function readConfig(configPath, env = 'development') {
	const dotenv = require('dotenv');
	dotenv.config({ path: path.resolve(configPath, `.env`) });
	dotenv.config({ path: path.resolve(configPath, `.env.${env}`) });

	const nconf = getConfigProvider();

	nconf.file({
		file: path.resolve(configPath, `config.${env}.js`),
		format: nconf.formats.js,
	});

	return nconf;
}
