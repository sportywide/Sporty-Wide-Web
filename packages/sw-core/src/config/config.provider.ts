import config from '@core/config';
import { CORE_CONFIG } from '@core/config/config.constant';

export const configProvider = {
	provide: CORE_CONFIG,
	useValue: config,
};
