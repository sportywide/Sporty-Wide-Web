import { Provider } from 'nconf';
import { PuppeteerService } from './../core/browser/browser.service';
import { SwBrowser } from './../core/browser/browser.class';
import { ResultsService } from './results.service';

export class BrowserService extends ResultsService {
	protected swBrowser: SwBrowser | null;
	constructor(private readonly puppeteerService: PuppeteerService, private readonly config: Provider) {
		super();
	}

	async init() {
		return this.browser();
	}
	async browser(): Promise<SwBrowser> {
		if (this.swBrowser) {
			return this.swBrowser;
		}
		this.swBrowser = await this.puppeteerService.startBrowser({
			proxyServer: this.config.get('proxy:url'),
		});
		return this.swBrowser;
	}

	async close() {
		if (!this.swBrowser) {
			return;
		}
		await this.swBrowser.close();
		this.swBrowser = null;
	}
}
