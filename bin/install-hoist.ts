import fs from 'fs';
import path from 'path';
import { mergePackageJson } from '../helpers/package';
import { execSync } from '../helpers/process';

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const originalPackageJson = fs.readFileSync(packageJsonPath);

try {
	const packageJson = mergePackageJson();
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4), {
		encoding: 'utf-8',
	});
	execSync('npm ci --production --no-optional');
} finally {
	fs.writeFileSync(packageJsonPath, originalPackageJson, {
		encoding: 'utf-8',
	});
}
