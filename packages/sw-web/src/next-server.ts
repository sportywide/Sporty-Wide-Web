import 'reflect-metadata';
import http from 'http';
import next from 'next';
import { isDevelopment } from '@shared/lib/utils/env';
import config from '@web/config';
declare const module: any;
const env = process.env.NODE_ENV;
import { bootstrap } from './app';
const nextApp = next({
	dir: './src',
	dev: isDevelopment(),
});

let server, express;

nextApp
	.prepare()
	.then(async () => {
		await startServer();

		if (module.hot) {
			module.hot.accept(err => console.error(err));
			module.hot.dispose(() => {
				console.info('Disposing entry module...');
				server.close();
			});

			module.hot.accept(['./app', './routes'], () => {
				server.removeListener('request', express);
				reloadServer();
			});
		}
	})
	.catch(err => {
		console.error('An error occurred, unable to start the server', err);
	});

function startServer() {
	console.info('Starting express application');

	return new Promise(resolve => {
		express = bootstrap(nextApp);
		const port = parseInt(config.get('port'), 10) || 3000;
		server = http.createServer(express);
		server.listen(port, () => {
			console.info(`> Ready on port ${port} [${env}]`);
			resolve();
		});
	});
}

function reloadServer() {
	console.info('Reload http server');
	// eslint-disable-next-line import/dynamic-import-chunkname
	import('./app').then(({ bootstrap }) => {
		express = bootstrap(nextApp);
		server.on('request', express);
		console.info('http server reloaded');
	});
}
