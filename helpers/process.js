const childProcess = require('child_process');

exports.execSync = function(command) {
	return childProcess.execSync(command, {
		stdio: 'inherit',
		encoding: 'utf-8',
	});
};
