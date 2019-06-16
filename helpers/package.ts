import fs from 'fs';
import path from 'path';

export function getDependencies({ rootDir = process.cwd(), packageName }) {
	const packageJson = JSON.parse(
		fs.readFileSync(path.resolve(rootDir, 'packages', packageName, 'package.json'), 'utf-8')
	);
	return [...Object.keys(packageJson.dependencies || {}), ...Object.keys(packageJson.devDependencies || {})]
		.filter(dependency => dependency.startsWith('sportywide-'))
		.map(dependency => dependency.replace('sportywide-', 'sw-'));
}

export function getAllPackages({ rootDir = process.cwd() } = {}) {
	const packagesDir = path.resolve(rootDir, 'packages');
	if (!fs.existsSync(packagesDir)) {
		return [];
	}
	return fs.readdirSync(packagesDir).filter(packageName => packageName.startsWith('sw-'));
}
