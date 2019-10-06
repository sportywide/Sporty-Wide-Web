import express from 'express';
import { isProduction } from '@shared/lib/utils/env';
import { authRouter } from '@web/api/auth/routes';
import { devProxy } from '@web/api/proxy';
import routes from '@web/routes';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import flash from 'express-cookie-flash';
import { getConfig } from '@web/config.provider';
import { COOKIE_CSRF } from '@web/api/auth/constants';

const config = getConfig();

const CSRF_WHITE_LIST = ['login', 'signup'];

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
