const packageName = process.argv[2];
const { getDependencies } = require('../helpers/package');

const dependencies = [packageName, ...getDependencies({ packageName })];
console.info('Found dependencies', dependencies);
const path = require('path');
const lastPackageChecksumPath = path.resolve('packages', packageName, '.last-npm-install.checksum');
const crypto = require('crypto');
const fs = require('fs');
const childProcess = require('child_process');

function checkLatestInstall() {
	console.info('Checking latest install');
	try {
		const currentChecksum = getCurrentPackageChecksum(dependencies);
		if (currentChecksum !== getLastPackageChecksum()) {
			installDependencies();
		} else {
			console.info('Nothing to install');
		}
	} catch (error) {
		console.error(error);
	}
}

function installDependencies() {
	console.log('Bootstrapping');
	childProcess.execSync('npm run bootstrap', { stdio: 'inherit' });
	fs.writeFileSync(lastPackageChecksumPath, getCurrentPackageChecksum(dependencies));
}

function getLastPackageChecksum() {
	if (fs.existsSync(lastPackageChecksumPath)) {
		return fs.readFileSync(lastPackageChecksumPath, 'utf8');
	}
	return null;
}

function getCurrentPackageChecksum(dependencies) {
	const computeHash = crypto.createHash('sha1');

	for (const dependency of dependencies) {
		const packageContents = fs.readFileSync(path.resolve('packages', dependency, 'package.json'), 'utf8');
		const packageLockContents = fs.readFileSync(path.resolve('packages', dependency, 'package-lock.json'), 'utf8');
		computeHash.update(packageContents + packageLockContents, 'utf8');
	}

	return computeHash.digest('hex');
}

checkLatestInstall();
