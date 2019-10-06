import { createConfig } from '@shared/lib/config/config-reader';
import { Provider } from 'nconf';
import { config } from './config';

let currentConfig: Provider;
export function getConfig() {
	if (currentConfig) {
		return currentConfig;
	}
	return (currentConfig = createConfig(config, process.env.NODE_ENV));
}
