import fs from 'fs';
import path from 'path';
import { fsPromise } from '@shared/lib/utils/promisify/fs';

describe('Testing promisifiedFs', () => {
	test('should return a promise instead of callback', async () => {
		const currentFile = path.resolve(__dirname, path.basename(__filename));
		const promise = fsPromise.readFile(currentFile, {
			encoding: 'utf8',
		});
		expect(typeof promise.then).toEqual('function');
		const returnValue = await promise;
		const content = fs.readFileSync(currentFile, {
			encoding: 'utf8',
		});
		expect(returnValue).toEqual(content);
	});
});
