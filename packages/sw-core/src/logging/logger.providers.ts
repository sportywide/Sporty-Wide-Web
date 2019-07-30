import { Log4js, Logger } from 'log4js';
import { LoggerProviderFactory } from '@core/logging/logger-provider.factory';
import { API_LOGGER, EMAIL_LOGGER, LOG4J_PROVIDER, SCHEMA_LOGGER } from '@core/logging/logging.constant';
import { Provider } from 'nconf';
import { CORE_CONFIG } from '@core/config/config.constants';

export const log4jsProviders = [
	{
		provide: LOG4J_PROVIDER,
		useFactory: (factory: LoggerProviderFactory, coreConfig: Provider): Log4js => {
			return factory.configure(coreConfig.get('logging:default'));
		},
		inject: [LoggerProviderFactory, CORE_CONFIG],
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
