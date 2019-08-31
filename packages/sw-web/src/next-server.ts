import 'reflect-metadata';
import next from 'next';
import { isDevelopment } from '@shared/lib/utils/env';
import config from '@web/config';
declare const module: any;
const env = process.env.NODE_ENV;
const app = next({
	dir: './src',
	dev: isDevelopment(),
});

let server;

app.prepare()
	.then(() => {
		serve(app);

		if (module.hot) {
			module.hot.accept('./app', () => {
				if (server) {
					server.close(() => {
						serve(app);
					});
				} else {
					serve(app);
				}
			});
		}
	})
	.catch(err => {
		console.error('An error occurred, unable to start the server', err);
	});

function serve(app) {
	console.info('Starting app');
	const { bootstrap } = require('./app');
	const express = bootstrap(app);

	return new Promise((resolve, reject) => {
		const port = parseInt(config.get('port'), 10) || 3000;
		server = express.listen(port, err => {
			if (err) {
				reject(err);
			}
			console.info(`> Ready on port ${port} [${env}]`);
			resolve();
		});
	});
}
