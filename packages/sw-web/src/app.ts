import express from 'express';
import { isDevelopment, isProduction } from '@shared/lib/utils/env';
import { authRouter } from '@web/api/auth/routes';
import { devProxy } from '@web/api/proxy';
import routes from '@web/routes';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import flash from 'express-cookie-flash';
import { getConfig } from '@web/config.provider';
import { COOKIE_CSRF } from '@web/api/auth/constants';
import log4js from 'log4js';
import { logzAppender } from '@shared/lib/utils/logging/logz';
import { colorPatternLayout, defaultPatternLayout } from '@shared/lib/utils/logging/layout';
import { log4jsFactory } from '@web/shared/lib/logginng';

const config = getConfig();

const CSRF_WHITE_LIST = ['login', 'signup', 'refresh-token'];

export function bootstrap(app) {
	const server = express();
	server.use(cookieParser(config.get('cookie_secret')));
	server.use(
		flash({
			secure: isProduction(),
		})
	);
	server.use(
		csurf({
			cookie: {
				secure: isProduction(),
			},
			whitelist: req => {
				return CSRF_WHITE_LIST.some(whiteListPath => req.path && req.path.endsWith(whiteListPath));
			},
		})
	);
	server.use(
		log4jsFactory.connectLogger(log4jsFactory.getLogger('http'), {
			level: 'INFO',
			nolog: '\\.js|\\.css|\\.png',
		})
	);
	server.get('/healthcheck', (req, res) => res.send('OK'));
	server.use('/auth', authRouter);
	setupProxy(devProxy);
	server.use((req, res, next) => {
		const cookies = req.cookies || {};

		if (cookies[COOKIE_CSRF]) {
			return next();
		}
		res.cookie(COOKIE_CSRF, (req as any).csrfToken(), {
			secure: isProduction(),
		});
		next();
	});
	const handler = routes.getRequestHandler(app);
	// Default catch-all handler to allow Next.js to handle all other routes
	server.use(handler);

	function setupProxy(proxy) {
		// Set up the proxy.
		const proxyMiddleware = require('http-proxy-middleware');
		Object.keys(proxy).forEach(function(context) {
			server.use(proxyMiddleware(context, proxy[context]));
		});
	}

	return server;
}
