import childProcess from 'child_process';
import path from 'path';

export function execSync(command, options = {}) {
	console.info('Executing command synchronously', command);
	return childProcess.execSync(command, {
		...getDefaultOptions(),
		...options,
	});
}

export function exec(command, options = {}) {
	console.info('Executing command', command);
	return new Promise((resolve, reject) => {
		const execOptions = {
			...getDefaultOptions(),
			...options,
		};
		childProcess.exec(command, execOptions, (error, stdout, stderr) => {
			if (error) {
				return reject(error);
			}
			resolve(stdout ? stdout : stderr);
		});
	});
}

export function spawnSync(command, options = {}) {
	const crossSpawn = require('cross-spawn');
	console.info('Spawning command', command);
	const spawnOptions = {
		...getDefaultOptions(),
		...options,
	};
	const child = crossSpawn.sync(command, spawnOptions);
	if (child.error) {
		throw new Error('Failed to spawn the command ' + child.error.message);
	}
	return child.stdout || child.stderr;
}

export function spawn(command, options = {}) {
	const crossSpawn = require('cross-spawn');
	console.info('Spawning command', command);
	return new Promise((resolve, reject) => {
		const spawnOptions = {
			...getDefaultOptions(),
			...options,
		};
		const child = crossSpawn(command, spawnOptions);
		child.on('close', function(code) {
			resolve(code);
		});
		child.on('error', function(err) {
			reject(err);
		});
	});
}

function getDefaultOptions(): any {
	const findup = require('find-up');
	return {
		stdio: 'inherit',
		encoding: 'utf-8',
		shell: true,
		env: {
			...(process.env || {}),
			PATH:
				path.resolve(
					findup.sync('node_modules', {
						type: 'directory',
					}),
					'.bin'
				) +
				path.delimiter +
				process.env.PATH,
		},
	};
}
