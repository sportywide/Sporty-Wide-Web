import path from 'path';
import { Injectable, Inject } from '@nestjs/common';
import { isProduction } from '@shared/lib/utils/env';
import { FILE_SERVICE, FileService } from '@core/io/file.provider';

@Injectable()
export class StylesheetService {
	private readonly styleCache: {};

	constructor(@Inject(FILE_SERVICE) private readonly fileService: FileService) {
		this.styleCache = {};
	}

	async css(...cssPath) {
		const cachedKey = JSON.stringify(cssPath);
		if (isProduction()) {
			if (this.styleCache[cachedKey]) {
				return this.styleCache[cachedKey];
			}
		}
		this.styleCache[cachedKey] = await this.fileService.read(path.resolve(__dirname, 'styles', ...cssPath));
		return this.styleCache[cachedKey];
	}
}
