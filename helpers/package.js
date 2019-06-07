const fs = require('fs');
const path = require('path');

exports.getDependencies = function({ rootDir = process.cwd(), packageName }) {
	const packageJson = JSON.parse(
		fs.readFileSync(path.resolve(rootDir, 'packages', packageName, 'package.json'), 'utf-8')
	);
	return [...Object.keys(packageJson.dependencies || {}), ...Object.keys(packageJson.devDependencies || {})]
		.filter(dependency => dependency.startsWith('sportywide-'))
		.map(dependency => dependency.replace('sportywide-', 'sw-'));
};

exports.getAllPackages = function({ rootDir = process.cwd() } = {}) {
	const packagesDir = path.resolve(rootDir, 'packages');
	if (!fs.existsSync(packagesDir)) {
		return [];
	}
	return fs.readdirSync(packagesDir).filter(package => package.startsWith('sw-'));
};
