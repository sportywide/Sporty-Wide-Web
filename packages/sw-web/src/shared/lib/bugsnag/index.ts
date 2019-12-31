import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import React from 'react';
import { isDevelopment } from '@shared/lib/utils/env';
import { isBrowser } from '@web/shared/lib/environment';

export const bugsnagClient = bugsnag({
	apiKey: '4ab91c2b6a65f0e0a669b1eb3cf97b2f',
	appType: 'web',
	appVersion: process.env.APP_VERSION,
	releaseStage: process.env.NODE_ENV,
	beforeSend: (report, cb) => {
		if (isDevelopment()) {
			report.ignore();
		}
		cb(null);
	},
});

bugsnagClient.use(bugsnagReact, React);

if (!isBrowser()) {
	const bugsnagExpress = require('@bugsnag/plugin-express');
	bugsnagClient.use(bugsnagExpress);
}
