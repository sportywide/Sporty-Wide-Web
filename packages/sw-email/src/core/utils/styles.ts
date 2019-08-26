import util from 'util';
import fs from 'fs';
import path from 'path';
import { isProduction } from '@shared/lib/utils/env';

const readFile = util.promisify(fs.readFile.bind(fs));

const cached = {};

export async function css(...filePath) {
	const cachedKey = JSON.stringify(filePath);
	if (isProduction()) {
		if (cached[cachedKey]) {
			return cached[cachedKey];
		}
	}
	cached[cachedKey] = await readFile(path.resolve(__dirname, 'styles', ...filePath), {
		encoding: 'utf8',
	});
	return cached[cachedKey];
}
