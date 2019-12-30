import express, { NextFunction, Request, Response } from 'express';
import { isProduction } from '@shared/lib/utils/env';
import { authRouter } from '@web/api/auth/routes';
import { devProxy } from '@web/api/proxy';
import routes from '@web/routes';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import flash from 'express-cookie-flash';
import { getConfig } from '@web/config.provider';
import { COOKIE_CSRF } from '@web/api/auth/constants';
import { log4jsFactory, logger } from '@web/shared/lib/logging';
import { networkLogOptions } from '@shared/lib/utils/logging/layout';

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

	server.use(log4jsFactory.connectLogger(log4jsFactory.getLogger('web-http'), networkLogOptions));
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
	const handler: any = routes.getRequestHandler(app);
	// Default catch-all handler to allow Next.js to handle all other routes
	server.use((req, res, next) => {
		handler(req, res, next).catch(e => next(e));
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		logger.error(`Error handling request ${req.url}`, err);
	});

	function setupProxy(proxy) {
		// Set up the proxy.
		const proxyMiddleware = require('http-proxy-middleware');
		Object.keys(proxy).forEach(function(context) {
			server.use(proxyMiddleware(context, proxy[context]));
		});
	}

	return server;
}
