import os from 'os';
import glob, { IOptions } from 'glob';
import { Provider } from '@nestjs/common';
import { wrap } from '@shared/lib/utils/object/proxy';
import { fsPromise } from '@shared/lib/utils/promisify/fs';

export class FileWrapper {
	constructor(private readonly fs: typeof fsPromise) {}

	read(filePath: string, options = {}) {
		return this.fs.readFile(filePath, { ...options, encoding: 'utf8' });
	}

	async lines(filePath) {
		const content = await this.read(filePath);
		return content.split(os.EOL);
	}

	list(pattern, options: IOptions) {
		return new Promise((resolve, reject) => {
			glob(pattern, options, (err, matches) => {
				if (err) {
					return reject(err);
				}
				resolve(matches);
			});
		});
	}
}

export const FILE_SERVICE = Symbol('FILE_SERVICE');

export const FileService = {};
export type FileService = FileWrapper & typeof fsPromise;

export const fileProvider: Provider = {
	provide: FILE_SERVICE,
	useFactory: () => {
		const fileService = new FileWrapper(fsPromise);
		return wrap(fileService, fsPromise) as FileService;
	},
};
