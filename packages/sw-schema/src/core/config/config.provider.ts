import config from '@schema/config';
import { SCHEMA_CONFIG } from '@schema/core/config/config.constant';

export const configProvider = {
	provide: SCHEMA_CONFIG,
	useValue: config,
};
