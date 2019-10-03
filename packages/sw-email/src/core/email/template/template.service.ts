import path from 'path';
import { Inject, Injectable } from '@nestjs/common';
import juice, { Options } from 'juice';
import pug from 'pug';
import { FILE_SERVICE, FileService } from '@core/io/file.provider';

@Injectable()
export class TemplateService {
	private readonly templateCache: {};

	constructor(@Inject(FILE_SERVICE) private readonly fileService: FileService) {
		this.templateCache = {};
	}

	async compile(...templatePath) {
		const cacheKey = JSON.stringify(templatePath);
		if (this.templateCache[cacheKey]) {
			return this.templateCache[cacheKey];
		}

		this.templateCache[cacheKey] = pug.compileFile(path.resolve(__dirname, 'assets', 'templates', ...templatePath));
		return this.templateCache[cacheKey];
	}

	injectCss(template: string, css: string, options?: Options) {
		return juice.inlineContent(template, css, options);
	}
}
