import config from '@api/config';
import { API_CONFIG } from '@api/core/config/config.constant';

export const configProvider = {
	provide: API_CONFIG,
	useValue: config,
};
