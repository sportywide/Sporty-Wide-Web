import express from 'express';
import next from 'next';
import config from './config';

const devProxy = {
	'/api': {
		target: config.get('server_url'),
		changeOrigin: true,
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
				server.use(proxyMiddleware(context, devProxy[context]));
			});
		}

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
