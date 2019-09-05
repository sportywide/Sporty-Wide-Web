import path from 'path';
import fs from 'fs';
import util from 'util';
import newman from 'newman';
import glob from 'glob';

const readFile = util.promisify(fs.readFile.bind(fs));

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

runApiTests().then(() => {
	console.info('Test suites run successfully');
});

let hasError = false;

async function runApiTests() {
	const IGNORE_COLLECTION = ['auth', 'cleanup'];
	await execPath(path.resolve(__dirname, 'collections', 'auth', 'auth.collection.json'));
	const collectionFiles = glob
		.sync(path.resolve(__dirname, 'collections', '**/*.collection.json'))
		.filter(collectionFile => !IGNORE_COLLECTION.includes(path.basename(collectionFile, '.collection.json')));
	await Promise.all(collectionFiles.map(execPath));
	await execPath(path.resolve(__dirname, 'collections', 'cleanup', 'cleanup.collection.json'));
	process.exit(hasError ? 1 : 0);
}

async function execPath(collectionFile) {
	const collectionDir = path.dirname(collectionFile);
	const basename = path.basename(collectionFile, '.collection.json');
	const collection =
		fs.existsSync(collectionFile) && JSON.parse(await readFile(collectionFile, { encoding: 'utf-8' }));

	if (!collection) {
		return;
	}

	const envFile = path.resolve(collectionDir, `${basename}.env.json`);
	const environment = (fs.existsSync(envFile) && JSON.parse(await readFile(envFile, { encoding: 'utf-8' }))) || [];

	return new Promise(resolve => {
		newman
			.run({
				collection,
				reporters: ['cli', 'html'],
				reporter: { html: { export: path.resolve(__dirname, 'reports', `${basename}.html`) } },
				globals: {
					values: [
						{
							key: 'sw_base_url',
							value: process.env.SW_API_URL || 'https://api.sportywidedev.com',
						},
					],
				},
				environment,
			})
			.on('start', function() {
				// on start of run, log to console
				console.info('running a collection...');
			})
			.on('request', function(err, args) {
				const requestPath = args.request.url.path.join('/');
				if (err) {
					console.error(`Cannot receive response for ${requestPath}`, err);
					return;
				}

				if (args.response.code >= 400) {
					const responseBody = args.response.stream,
						response = responseBody.toString();
					console.error(`Request ${requestPath} failed with`, response);
				}
			})
			.on('done', function(err, summary) {
				if (err || summary.error) {
					console.error('collection run encountered an error.');
				} else if (summary.run.failures && summary.run.failures.length) {
					console.info(`collection run failed with ${summary.run.failures.length} error(s)`);
					hasError = true;
				} else {
					console.info('collection run completed.');
				}
				resolve();
			});
	});
}
