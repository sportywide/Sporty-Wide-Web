import bugsnag, { Bugsnag } from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import React from 'react';
import { isProduction } from '@shared/lib/utils/env';
import { isBrowser } from '@web/shared/lib/environment';
import { logger } from '@web/shared/lib/logging';

export const bugsnagClient = bugsnag({
	apiKey: '4ab91c2b6a65f0e0a669b1eb3cf97b2f',
	appType: 'web',
	appVersion: process.env.APP_VERSION,
	releaseStage: process.env.NODE_ENV,
	beforeSend: (report, cb) => {
		if (!isProduction()) {
			report.ignore();
		}
		cb(null);
	},
	logger,
	onUncaughtException(err, report: Bugsnag.Report, logger: Bugsnag.ILogger) {
		logger.error(`Uncaught exception${getContext(report)} ${err && err.stack ? err.stack : err}`);
	},
});

bugsnagClient.use(bugsnagReact, React);

if (!isBrowser()) {
	const bugsnagExpress = require('@bugsnag/plugin-express');
	bugsnagClient.use(bugsnagExpress);
}

const getContext = report =>
	report.request && Object.keys(report.request).length
		? ` at ${report.request.httpMethod} ${report.request.path || report.request.url}`
		: ``;
