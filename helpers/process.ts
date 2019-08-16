import childProcess from 'child_process';

export function execSync(command) {
	console.info('Executing command', command);
	return childProcess.execSync(command, {
		stdio: 'inherit',
		encoding: 'utf-8',
	});
}
