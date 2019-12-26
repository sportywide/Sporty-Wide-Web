import os from 'os';
import logz from 'logzio-nodejs';

export function logzAppender(token) {
	return {
		configure(config, layouts) {
			const logger = logz.createLogger({
				token,
				host: 'listener.logz.io',
				type: 'nodejs',
			});
			let layout = layouts.messagePassThrough;
			if (config.layout) {
				// load the layout
				layout = layouts.layout(config.layout.type, config.layout);
			}

			return loggingEvent => {
				const message = layout(loggingEvent);
				logger.log({
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
