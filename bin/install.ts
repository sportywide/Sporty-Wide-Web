import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { getAllPackages } from '../helpers/package';
import { execSync } from '../helpers/process';
const allPackages = getAllPackages();
const CHECKSUM_FILE = '.last-npm-install.checksum';
const isProduction = process.env.NODE_ENV === 'production';
const noOptional = !!process.env.NO_OPTIONAL;
if (isProduction) {
	console.info('Install in production mode');
}

if (noOptional) {
	console.info('No Optional Dependencies');
}

ensureNpmInstall();

// eslint-disable-next-line import/order
import { argv } from 'yargs';
const forceInstall = argv.f || argv.force;
checkLatestInstall();

function checkLatestInstall() {
	console.info('Checking latest install');
	try {
		if (forceInstall) {
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
		execSync(isProduction ? 'npm ci --production --no-optional' : `npm ci ${noOptional ? '--no-optional' : ''}`);
		execSync('npm audit fix');
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
	return currentChecksum !== getLastPackageChecksum(process.cwd());
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
	if (!fs.existsSync(path.resolve(dir, 'node_modules'))) {
		return;
	}
	const currentChecksum = getCurrentPackageChecksum(dir);
	fs.writeFileSync(path.resolve(dir, 'node_modules', CHECKSUM_FILE), currentChecksum, {
		encoding: 'utf-8',
	});
}

function installSubPackagesDependencies() {
	if (isProduction) {
		execSync('npm run bootstrap:prod');
	} else if (noOptional) {
		execSync('npm run bootstrap:no-optional');
	} else {
		execSync('npm run bootstrap');
	}
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
