import express from 'express';
import next from 'next';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { devProxy } from '@web/api/proxy';
import { isDevelopment, isProduction } from '@shared/lib/utils/env';
import { authRouter } from '@web/api/auth/routes';
import config from './config';
const CSRF_WHITE_LIST = ['login', 'signup'];

const port = parseInt(config.get('port'), 10) || 3000;
const env = process.env.NODE_ENV;
const app = next({
	dir: './src',
	dev: isDevelopment(),
});

const handle = app.getRequestHandler();

let server;
app.prepare()
	.then(() => {
		server = express();
		server.use(cookieParser());
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

		// Default catch-all handler to allow Next.js to handle all other routes
		server.all('*', (req, res) => handle(req, res));

		server.listen(port, err => {
			if (err) {
				throw err;
			}
			console.log(`> Ready on port ${port} [${env}]`);
		});
	})
	.catch(err => {
		console.log('An error occurred, unable to start the server');
		console.log(err);
	});

function setupProxy(proxy) {
	// Set up the proxy.
	const proxyMiddleware = require('http-proxy-middleware');
	Object.keys(proxy).forEach(function(context) {
		server.use(proxyMiddleware(context, proxy[context]));
	});
}
