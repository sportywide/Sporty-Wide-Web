import fs from 'fs';
import path from 'path';
import { mergePackageJson } from '@root/helpers/package';
import { spawnSync } from '@root/helpers/process';
import paths from '@build/paths';
import { sigstop } from '@shared/lib/utils/signals/sigstop';
const argv = require('yargs').argv;
const stage = argv.stage || 'production';

const packageJSONPath = path.resolve(paths.project.root, 'package.json');
const previousContent = fs.readFileSync(packageJSONPath, {
	encoding: 'utf8',
});
sigstop(() => {
	console.info('Received exit signal');
	restorePackageJson();
});

try {
	const newContent = JSON.stringify(
		mergePackageJson({
			rootDir: paths.project.root,
		}),
		null,
		4
	);
	fs.writeFileSync(packageJSONPath, newContent, {
		encoding: 'utf8',
	});
	spawnSync(`npx sls deploy --stage ${stage} --force`);
} catch (e) {
	console.error(e);
} finally {
	restorePackageJson();
}

function restorePackageJson() {
	fs.writeFileSync(packageJSONPath, previousContent, {
		encoding: 'utf8',
	});
}
