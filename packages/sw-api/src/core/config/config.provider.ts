import config from '@api/config';

export const configProvider = {
	provide: 'API_CONFIG',
	useValue: config,
};
