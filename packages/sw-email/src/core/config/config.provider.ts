import config from '@email/config';
import { EMAIL_CONFIG } from '@email/core/config/config.constant';

export const configProvider = {
	provide: EMAIL_CONFIG,
	useValue: config,
};
