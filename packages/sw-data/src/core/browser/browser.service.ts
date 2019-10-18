import { DATA_CONFIG } from '@core/config/config.constants';
import { Inject } from '@nestjs/common';
import { Provider } from 'nconf';
import { Logger } from 'log4js';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { LaunchOptions } from 'puppeteer-core';
import { SwBrowserWrapper } from '@data/core/browser/browser.class';

export class PuppeteerService {
	constructor(
		@Inject(DATA_CONFIG) private readonly config: Provider,
		@Inject(DATA_LOGGER) private readonly logger: Logger
	) {}

	startBrowser(options: LaunchOptions = {}) {
		return SwBrowserWrapper.create({ logger: this.logger, config: this.config, options });
	}
}
