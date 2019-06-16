import childProcess from 'child_process';

export function execSync(command) {
	return childProcess.execSync(command, {
		stdio: 'inherit',
		encoding: 'utf-8',
	});
}
