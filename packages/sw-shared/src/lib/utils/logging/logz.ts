import os from 'os';
import logz from 'logzio-nodejs';
import { get } from 'lodash';
import { Request } from 'express';
import { getIP } from '@shared/lib/utils/logging/layout';

let logger;

export function logzAppender(token) {
	return {
		configure(config, layouts) {
			let layout = layouts.messagePassThrough;
			if (config.layout) {
				// load the layout
				layout = layouts.layout(config.layout.type, config.layout);
			}

			return loggingEvent => {
				if (!logger) {
					logger = logz.createLogger({
						token,
						host: 'listener.logz.io',
						type: 'nodejs',
					});
				}
				const message = layout(loggingEvent);
				const res = get(loggingEvent, 'context.res');
				const req: Request = get(loggingEvent, 'context.res.req');
				logger.log({
					statusCode: res && res.statusCode,
					url: req && req.url,
					ip: req && getIP(req),
					message,
					level: loggingEvent.level.levelStr,
					category: loggingEvent.categoryName,
					hostname: os.hostname().toString(),
					env: process.env.NODE_ENV,
				});
			};
		},
	};
}
