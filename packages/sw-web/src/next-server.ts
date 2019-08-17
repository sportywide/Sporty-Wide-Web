import express, { Request } from 'express';
import next from 'next';
import csurf from 'csurf';
import { COOKIE_JWT_PAYLOAD, COOKIE_JWT_SIGNATURE } from '@web/api/auth/constants';
import { authRoute } from '@web/api/auth/routes';
import config from './config';
const CSRF_WHITE_LIST = ['login', 'signup'];
const isProduction = process.env.NODE_ENV === 'production';

const devProxy = {
	'/api': {
		target: config.get('server_url'),
		changeOrigin: true,
		onProxyReq: function(proxyReq, req: Request) {
			const jwtPayload = req.cookies[COOKIE_JWT_PAYLOAD];
			const jwtSignature = req.cookies[COOKIE_JWT_SIGNATURE];

			if (jwtPayload && jwtSignature) {
				proxyReq.set('Authorization', `Bearer ${jwtPayload}:${jwtSignature}`);
			}
		},
	},
};

const port = parseInt(config.get('port'), 10) || 3000;
const env = process.env.NODE_ENV;
const dev = env !== 'production';
const app = next({
	dir: './src',
	dev,
});

const handle = app.getRequestHandler();

let server;
app.prepare()
	.then(() => {
		server = express();

		// Set up the proxy.
		if (dev && devProxy) {
			const proxyMiddleware = require('http-proxy-middleware');
			Object.keys(devProxy).forEach(function(context) {
				server.use(
					context,
					csurf({
						cookie: {
							secure: isProduction,
						},
						whitelist: req => {
							return CSRF_WHITE_LIST.some(whiteListPath => req.path && req.path.endsWith(whiteListPath));
						},
					})
				);
				server.use(proxyMiddleware(context, devProxy[context]));
			});
		}

		server.use('auth', authRoute);

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
