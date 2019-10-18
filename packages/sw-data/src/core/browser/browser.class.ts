/* globals window, navigator, Notification, fetch */
import { wrap } from '@shared/lib/utils/object/proxy';
import puppeteer, { Browser, Page, LaunchOptions, ClickOptions } from 'puppeteer-core';
import { Logger } from 'log4js';
const MAX_ATTEMPTS = 3;

export type SwBrowser = SwBrowserWrapper & Browser;

export class SwBrowserWrapper {
	private readonly browser: Browser;
	private readonly logger: Logger;
	private quiet: boolean;

	static async create({ logger, config, options = {} }): Promise<SwBrowser> {
		const browserOptions: LaunchOptions = {
			ignoreHTTPSErrors: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
			executablePath: config.get('puppeteer:executable'),
			...options,
		};

		const browser = await puppeteer.launch(browserOptions);
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
			if (['error', 'warning'].includes(consoleMessage.type())) {
				this.log('error', page.url, consoleMessage);
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
			'Mozilla/5.0 (X11; Linux x86_64)' +
			'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
		await page.setUserAgent(userAgent);

		await page.evaluateOnNewDocument(() => {
			Object.defineProperty(navigator, 'webdriver', {
				get: () => false,
			});
		});

		await page.evaluateOnNewDocument(() => {
			// Overwrite the `plugins` property to use a custom getter.
			Object.defineProperty(navigator, 'languages', {
				get: () => ['en-US', 'en'],
			});
		});

		await page.evaluateOnNewDocument(() => {
			// We can mock this in as much depth as we need for the test.
			(window.navigator as any).chrome = {
				runtime: {},
				// etc.
			};
		});

		await page.evaluateOnNewDocument(() => {
			const originalQuery = window.navigator.permissions.query;
			return (window.navigator.permissions.query = parameters =>
				// @ts-ignore
				parameters.name === 'notifications'
					? Promise.resolve({ state: Notification.permission })
					: originalQuery(parameters));
		});

		await page.evaluateOnNewDocument(() => {
			// Overwrite the `plugins` property to use a custom getter.
			Object.defineProperty(navigator, 'plugins', {
				// This just needs to have `length > 0` for the current test,
				// but we could mock the plugins too if necessary.
				get: () => [1, 2, 3, 4, 5],
			});
		});

		const pageWrapper = new SwPageWrapper({ page, logger: this.logger });

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
	constructor({ page, logger }) {
		this.page = page;
		this.logger = logger;
	}

	async retryGoTo({ url, opts, maxAttempts = MAX_ATTEMPTS }) {
		for (let i = 1; i <= maxAttempts; i++) {
			try {
				await this.page.goto(url, opts);
				return true;
			} catch (e) {
				console.error(`(Attempt ${i}/${maxAttempts}) Fail to go to ${url}: ${e}`);
			}
		}
		return false;
	}

	async navigateTo(url, { cookieSelector = '' } = {}) {
		await this.page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'] });
		if (cookieSelector) {
			await this.click(cookieSelector);
		}
	}

	async click(selector: string, options: ClickOptions = {}) {
		try {
			await this.page.click(selector, options);
		} catch (e) {}
	}

	async clickMultiple(selector) {
		await this.page.$$eval(selector, links => links.map(link => (link as any).click()));
	}

	get(url, options = {}): Promise<Response> {
		return this.request({
			url,
			options: { method: 'GET', credentials: 'include', ...options },
		});
	}

	request({ url, options = {} }: { url: string; options: RequestInit }): Promise<any> {
		return this.page.evaluate(
			data => {
				return fetch(data.url, data.options)
					.then(response => console.error(response))
					.catch(err => {
						console.error('Failed to make XHR request', err);
					});
			},
			{ url, options: options as any }
		);
	}
}
