import log4js from '@root/node_modules/log4js';
import { logzAppender } from '@shared/lib/utils/logging/logz';
import { colorPatternLayout, defaultPatternLayout } from '@shared/lib/utils/logging/layout';
import { isDevelopment } from '@shared/lib/utils/env';
import { getConfig } from '@web/config.provider';
const config = getConfig();

export const log4jsFactory = log4js.configure({
	appenders: {
		logz: {
			type: logzAppender(config.get('logging:logz:token')),
			layout: defaultPatternLayout,
		},
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
		http: {
			appenders: [isDevelopment() ? 'console' : 'logz'],
			level: config.get('logging:level'),
			// @ts-ignore
			enableCallStack: true,
		},
	},
});

export const logger = log4jsFactory.getLogger('web');
