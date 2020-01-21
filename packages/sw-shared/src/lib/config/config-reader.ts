import nconf from 'nconf';
import { merge } from 'lodash';

export function getConfigProvider() {
	const provider = new nconf.Provider({});
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

export function createConfig(config = {}, env = 'development') {
	const nconf = getConfigProvider();

	const envConfig = config[env] || {};
	const defaultConfig = config['default'] || {};
	const mergedConfig = merge(defaultConfig, envConfig);

	nconf.defaults(mergedConfig);
	return nconf;
}
