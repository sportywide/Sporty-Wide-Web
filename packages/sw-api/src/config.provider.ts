import config from './config';

export const configProvider = {
	provide: 'API_CONFIG',
	useValue: config,
};
