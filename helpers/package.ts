import fs from 'fs';
import path from 'path';
import glob from 'glob';

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

export function mergePackageJson({ rootDir = process.cwd() } = {}) {
	const rootPackageJson = require(path.resolve(rootDir, 'package.json'));

	const subPackageJsonFiles = glob.sync(path.resolve(rootDir, 'packages/**/package.json'), {
		absolute: true,
	});

	const packageJsonContents = subPackageJsonFiles.map(subPackageJsonFile => require(subPackageJsonFile));

	return packageJsonContents.reduce((currentContent, content) => {
		return {
			...currentContent,
			devDependencies: {
				...(currentContent.devDependencies || {}),
				...(content.devDependencies || {}),
			},
			optionalDependencies: {
				...(currentContent.optionalDependencies || {}),
				...(content.optionalDependencies || {}),
			},
			dependencies: {
				...(currentContent.dependencies || {}),
				...(content.dependencies || {}),
			},
			peerDependencies: {
				...(currentContent.peerDependencies || {}),
				...(content.peerDependencies || {}),
			},
		};
	}, rootPackageJson);
}
