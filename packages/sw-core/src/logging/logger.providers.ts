import { Log4js, Logger } from 'log4js';
import { LoggerProviderFactory } from '@core/logging/logger-provider.factory';
import { API_LOGGER, EMAIL_LOGGER, LOG4J_PROVIDER, SCHEMA_LOGGER } from '@core/logging/logging.constant';

export const log4jsProviders = [
	{
		provide: LOG4J_PROVIDER,
		useFactory: (factory: LoggerProviderFactory): Log4js => {
			return factory.configure();
		},
		inject: [LoggerProviderFactory],
	},
	{
		provide: API_LOGGER,
		useFactory: (log4js: Log4js): Logger => {
			return log4js.getLogger('api');
		},
		inject: [LOG4J_PROVIDER],
	},
	{
		provide: SCHEMA_LOGGER,
		useFactory: (log4js: Log4js): Logger => {
			return log4js.getLogger('schema');
		},
		inject: [LOG4J_PROVIDER],
	},
	{
		provide: EMAIL_LOGGER,
		useFactory: (log4js: Log4js): Logger => {
			return log4js.getLogger('email');
		},
		inject: [LOG4J_PROVIDER],
	},
];
