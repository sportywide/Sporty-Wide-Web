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
