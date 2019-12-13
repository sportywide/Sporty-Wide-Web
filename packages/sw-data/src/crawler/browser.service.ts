import { Provider } from 'nconf';
import { Injectable, Inject } from '@nestjs/common';
import { DATA_CONFIG } from '@core/config/config.constants';
import { PuppeteerService } from './../core/browser/browser.service';
import { SwBrowser } from './../core/browser/browser.class';

@Injectable()
export class BrowserService {
	protected swBrowser: Promise<SwBrowser>;
	constructor(
		private readonly puppeteerService: PuppeteerService,
		@Inject(DATA_CONFIG) private readonly config: Provider
	) {}

	async browser(): Promise<SwBrowser> {
		if (this.swBrowser) {
			return this.swBrowser;
		}
		this.swBrowser = this.puppeteerService.startBrowser({
			proxyServer: this.config.get('proxy:url'),
		});
		return this.swBrowser;
	}

	async close() {
		if (!this.swBrowser) {
			return;
		}
		(await this.swBrowser).close();
		this.swBrowser = null;
	}
}
