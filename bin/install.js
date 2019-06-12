const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const { getAllPackages } = require('../helpers/package');
const { execSync } = require('../helpers/process');
const allPackages = getAllPackages();
const CHECKSUM_FILE = '.last-npm-install.checksum';
ensureNpmInstall();
const argv = require('yargs').argv;

checkLatestInstall();

function checkLatestInstall() {
	console.info('Checking latest install');
	try {
		const forceInstall = argv.f || argv.force;
		if (forceInstall) {
			installBaseDependencies();
			installSubPackagesDependencies();
			updateChecksum();
		} else {
			const basePackageChanged = checkBasePackage();
			const subPackagesChanged = checkSubPackages();
			if (basePackageChanged || subPackagesChanged) {
				if (allPackages.length) {
					installSubPackagesDependencies();
				}
				updateChecksum();
			} else {
				console.info('Up to date');
			}
		}
	} catch (error) {
		console.error(error);
	}
}

function ensureNpmInstall() {
	if (!fs.existsSync('node_modules')) {
		console.log('Installing node_modules');
		execSync('npm ci');
		updateChecksum();
	}
}

function updateChecksum() {
	for (const packageName of allPackages) {
		writeCheckSum(path.resolve('packages', packageName));
	}
	writeCheckSum(process.cwd());
}

function checkBasePackage() {
	console.info('Checking base package');
	const currentChecksum = getCurrentPackageChecksum(process.cwd());
	if (currentChecksum !== getLastPackageChecksum(process.cwd())) {
		installBaseDependencies();
		return true;
	}
	return false;
}

function checkSubPackages() {
	console.info('Checking sub packages');
	if (allPackages.length === 0) {
		return false;
	}

	return allPackages.some(packageName => {
		const packageDir = path.resolve('packages', packageName);
		const currentChecksum = getCurrentPackageChecksum(packageDir);
		return currentChecksum !== getLastPackageChecksum(packageDir);
	});
}

function writeCheckSum(dir) {
	const currentChecksum = getCurrentPackageChecksum(dir);
	fs.writeFileSync(path.resolve(dir, 'node_modules', CHECKSUM_FILE), currentChecksum, {
		encoding: 'utf-8',
	});
}

function installBaseDependencies() {
	execSync('npm install');
}

function installSubPackagesDependencies() {
	execSync('npm run bootstrap');
}

function getLastPackageChecksum(dir) {
	const checksumPath = path.resolve(dir, 'node_modules', CHECKSUM_FILE);
	if (fs.existsSync(checksumPath)) {
		return fs.readFileSync(checksumPath, 'utf8');
	}
	return null;
}

function getCurrentPackageChecksum(dir) {
	const computeHash = crypto.createHash('sha1');
	const packageLockPath = path.resolve(dir, 'package-lock.json');
	const packageContents = fs.readFileSync(path.resolve(dir, 'package.json'), 'utf8');
	const packageLockContents = fs.existsSync(packageLockPath) ? fs.readFileSync(packageLockPath, 'utf8') : '';
	computeHash.update(packageContents + packageLockContents, 'utf8');
	return computeHash.digest('hex');
}
