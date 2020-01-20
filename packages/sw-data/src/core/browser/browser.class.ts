/* globals window, navigator, Notification, fetch */
import { wrap } from '@shared/lib/utils/object/proxy';
import puppeteer, { Browser, Page, LaunchOptions, ClickOptions } from 'puppeteer-core';
import { Logger } from 'log4js';
const MAX_ATTEMPTS = 3;
import { Provider } from 'nconf';
import { isDevelopment } from '@shared/lib/utils/env';

export type SwBrowser = SwBrowserWrapper & Browser;

export class SwBrowserWrapper {
	private readonly browser: Browser;
	private readonly logger: Logger;
	private quiet: boolean;

	static async create({
		logger,
		config,
		options = {},
	}: {
		logger: Logger;
		config: Provider;
		options: any;
	}): Promise<SwBrowser> {
		let proxyServer;
		if (options.proxyServer) {
			proxyServer = options.proxyServer;
			delete options.proxyServer;
		}
		let browser;
		if (process.env.IS_LAMBDA && !isDevelopment()) {
			const chromium = require('chrome-aws-lambda');
			browser = await chromium.puppeteer.launch({
				args: [...chromium.args, proxyServer ? `--proxy-server=${proxyServer}` : null].filter(arg => arg),
				defaultViewport: chromium.defaultViewport,
				executablePath: await chromium.executablePath,
				headless: chromium.headless,
			});
		} else {
			const browserOptions: LaunchOptions = {
				ignoreHTTPSErrors: true,
				headless: true,
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--lang=en-US,en;q=0.9',
					proxyServer ? `--proxy-server=${proxyServer}` : null,
				].filter(arg => arg),
				executablePath: config.get('puppeteer:executable'),
				...options,
			};
			browser = await puppeteer.launch(browserOptions);
		}
		const browserWrapper = new SwBrowserWrapper({ browser, logger });

		return wrap(browserWrapper, browser);
	}

	setQuiet(quiet) {
		this.quiet = quiet;
	}

	constructor({ browser, logger }) {
		this.browser = browser;
		this.logger = logger;
	}

	async newPage(): Promise<SwPage> {
		const page = await this.browser.newPage();
		await page.on('console', consoleMessage => {
			const type = consoleMessage.type();
			if (['error', 'warning'].includes(type)) {
				this.log(type === 'error' ? 'error' : 'warn', page.url, consoleMessage);
			}
		});

		await page.on('error', err => {
			this.log('error', page.url, err);
		});

		await page.on('pageerror', err => {
			this.log('error', page.url, err);
		});

		// prevent site blocking of Headless Chrome: https://intoli.com/blog/not-possible-to-block-chrome-headless/
		const userAgent =
			'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36';
		await page.setUserAgent(userAgent);

		await page.evaluateOnNewDocument(() => {
			Object.defineProperty(navigator, 'webdriver', {
				get: () => false,
			});
			Object.defineProperty(navigator, 'languages', {
				get: function() {
					return ['en-US', 'en'];
				},
			});
			(window.navigator as any).chrome = {
				runtime: {},
				// etc.
			};

			const originalQuery = window.navigator.permissions.query;
			window.navigator.permissions.query = parameters =>
				//@ts-ignore
				parameters.name === 'notifications'
					? Promise.resolve({ state: Notification.permission })
					: originalQuery(parameters);

			// overwrite the `plugins` property to use a custom getter
			Object.defineProperty(navigator, 'plugins', {
				get: function() {
					// this just needs to have `length > 0`, but we could mock the plugins too
					return [1, 2, 3, 4, 5];
				},
			});
		});

		const pageWrapper = new SwPageWrapper({ page, logger: this.logger, browser: this });

		return wrap(pageWrapper, page);
	}

	log(level, message, ...args) {
		if (this.quiet) {
			return;
		}
		this.logger[level](message, ...args);
	}
}

export type SwPage = SwPageWrapper & Page;

class SwPageWrapper {
	private readonly page: Page;
	private readonly logger: Logger;
	private readonly browserWrapper: SwBrowser;

	constructor({ page, logger, browser }) {
		this.page = page;
		this.logger = logger;
		this.browserWrapper = browser;
	}

	browser() {
		return this.browserWrapper;
	}

	async retryGoTo({ url, opts, maxAttempts = MAX_ATTEMPTS }) {
		for (let i = 1; i <= maxAttempts; i++) {
			try {
				await this.page.goto(url, opts);
				return true;
			} catch (e) {
				this.logger.error(`(Attempt ${i}/${maxAttempts}) Fail to go to ${url}: ${e}`);
			}
		}
		return false;
	}

	async navigateTo(url, { cookieSelector = '', options = {} } = {}) {
		const response = await this.page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'], ...options });
		if (cookieSelector) {
			await this.click(cookieSelector);
			await this.page.waitForSelector(cookieSelector, {
				hidden: true,
				timeout: 10000,
			});
		}
		return response;
	}

	async click(selector: string, options: ClickOptions = {}) {
		try {
			await this.page.click(selector, options);
		} catch (e) {}
	}

	async clickMultiple(selector) {
		await this.page.$$eval(selector, links => links.map(link => (link as any).click()));
	}

	get(url, options = {}): Promise<any> {
		return this.request({
			url,
			options: { method: 'GET', ...options },
		});
	}

	request({ url, options = {} }: { url: string; options: RequestInit }): Promise<any> {
		return this.page.evaluate(
			data => {
				return fetch(data.url, data.options)
					.then(response => response.json())
					.catch(err => {
						console.error('Failed to make XHR request', err);
					});
			},
			{ url, options: options as any }
		);
	}
}
