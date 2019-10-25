import path from 'path';
import { resourcesPath } from '@root/packages/sw-data/src/data.constants';
import { fsPromise } from '@shared/lib/utils/promisify/fs';
import fsExtra from 'fs-extra';

export class ResultsService {
	async writeResult(relativePath, result) {
		const outputPath = path.resolve(resourcesPath, relativePath);
		await fsExtra.mkdirp(path.dirname(outputPath));
		await fsPromise.writeFile(outputPath, JSON.stringify(result, null, 4), {
			encoding: 'utf-8',
		});
	}
}
