import nconf from 'nconf';
import JsFormat from 'nconf-js';
import path from 'path';
(nconf.formats as any).js = new JsFormat();

export function getConfigProvider() {
	//@ts-ignore
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

export function readConfig(configPath, env = 'development') {
	const dotenv = require('dotenv');
	dotenv.config({ path: path.resolve(configPath, `.env`) });
	dotenv.config({ path: path.resolve(configPath, `.env.${env}`) });

	const nconf = getConfigProvider();

	nconf.file('environments', {
		file: path.resolve(configPath, `config.${env}.js`),
		format: nconf.formats.js,
	});

	nconf.file('defaults', {
		file: path.resolve(configPath, `config.default.js`),
		format: nconf.formats.js,
	});

	return nconf;
}
