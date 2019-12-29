import log4js from 'log4js';
import { logzAppender } from '@shared/lib/utils/logging/logz';
import { colorPatternLayout, defaultPatternLayout } from '@shared/lib/utils/logging/layout';
import { getConfig } from '@web/config.provider';
import { isDevelopment } from '@shared/lib/utils/env';

const config = getConfig();

const logConfig: any = {
	appenders: {
		console: {
			type: 'console',
			layout: colorPatternLayout,
		},
	},
	categories: {
		default: {
			appenders: [isDevelopment() ? 'console' : 'logz'],
			level: config.get('logging:level'),
			// @ts-ignore
			enableCallStack: true,
		},
		'web-http': {
			appenders: [isDevelopment() ? 'console' : 'logz'],
			level: config.get('logging:level'),
			// @ts-ignore
			enableCallStack: true,
		},
	},
};

if (config.get('logging:logz')) {
	logConfig.appenders.logz = {
		type: logzAppender(config.get('logging:logz:token')),
		layout: defaultPatternLayout,
	};
}
export const log4jsFactory = log4js.configure(logConfig);

export const logger = log4jsFactory.getLogger('web');
