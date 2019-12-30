import bugsnag from '@bugsnag/js';
import bugsnagExpress from '@bugsnag/plugin-express';
import { isDevelopment } from '@shared/lib/utils/env';

export const bugsnagClient = bugsnag({
	apiKey: 'a6924004238e05838e8684c10d9269ad',
	appType: 'api',
	appVersion: process.env.APP_VERSION,
	releaseStage: process.env.NODE_ENV,
	beforeSend: (report, cb) => {
		if (isDevelopment()) {
			report.ignore();
		}
		cb(null);
	},
});

bugsnagClient.use(bugsnagExpress);
