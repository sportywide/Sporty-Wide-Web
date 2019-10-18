import path from 'path';
import { Injectable, Inject } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { PuppeteerService } from '@data/core/browser/browser.service';
import { SwBrowser, SwPage } from '@data/core/browser/browser.class';
import Cheerio from 'cheerio';
import { Logger } from 'log4js';
import fsExtra from 'fs-extra';
import { resourcesPath } from '@data/crawler/crawler.constants';
import { fsPromise } from '@shared/lib/utils/promisify/fs';
import { format } from 'date-fns';
import { DATA_LOGGER } from '@core/logging/logging.constant';

@Injectable()
export class ScoreCrawlerService {
	private readonly axios: AxiosInstance;
	private swBrowser: SwBrowser;
	private initiated: boolean;
	constructor(
		private readonly puppeteerService: PuppeteerService,
		@Inject(DATA_LOGGER) private readonly dataLogger: Logger
	) {}

	async init() {
		if (this.initiated) {
			return;
		}
		const browser = await this.browser();
		const page = await browser.newPage();

		await page.navigateTo('https://www.whoscored.com/AboutUs');
		const cookieButton = await page.$('#qcCmpButtons > button:nth-child(2)');
		if (cookieButton) {
			cookieButton!!.evaluate(button => (button as any).click());
		}
		this.initiated = true;
	}

	async browser() {
		if (this.swBrowser) {
			return this.swBrowser;
		}
		this.swBrowser = await this.puppeteerService.startBrowser();
		return this.swBrowser;
	}

	async getLiveMatches(date: Date) {
		this.dataLogger.info('Getting matches for date', format(date, 'yyyy-MM-dd'));
		const browser = await this.browser();
		const page = await browser.newPage();
		browser.setQuiet(true);
		await page.navigateTo(`https://www.whoscored.com/LiveScores#`, {
			cookieSelector: '#qcCmpButtons > button:nth-child(2)',
		});
		browser.setQuiet(false);
		await this.waitForResults(page);
		await this.selectDate(page, date);
		await page.clickMultiple('tr.item .show-incidents');
		const content = await page.content();
		const $ = Cheerio.load(content);
		return this.parseLiveScores($, date);
	}

	private async selectDate(page, date: Date) {
		const year = date.getFullYear();
		const month = date.getMonth();
		const day = date.getDate();
		await page.click('#date-config-toggle-button');
		// year selector
		await page.click(
			`#date-config > div.datepicker-wrapper > div > table > tbody > tr > td:nth-child(1) > div > table > tbody > tr > td[data-value="${year}"]`
		);

		// month selector
		await page.click(
			`#date-config > div.datepicker-wrapper > div > table > tbody > tr > td:nth-child(2) > div > table > tbody > tr > td[data-value="${month}"]`
		);

		await page.click(
			`#date-config > div.datepicker-wrapper > div > table > tbody > tr > td:nth-child(3) > div > table > tbody > tr > td[data-value="${day -
				1}"]`
		);
		await this.waitForResults(page);
	}

	private parseLiveScores($: CheerioStatic, date) {
		const resultTable = $('#livescores > table');
		const scores = resultTable.find('tr.item');
		return Array.from(scores).map(node => {
			const resultElement = $(node);
			const groupId = resultElement.data('group-id');
			const matchId = resultElement.attr('id');
			const groupElement = resultTable.find(`#g${groupId}`);
			const tournamentLink = groupElement.find('.tournament-link').attr('href');
			const [, whoscoreLeagueId] = /\/Regions\/\d+\/Tournaments\/(\d+)/.exec(tournamentLink);
			let [, league] = groupElement
				.find('.group-name')
				.text()
				.split('-');
			league = league.trim().replace(/^\d+\./, '');
			const time = resultElement.find('td.time').text();
			const [hour, minute] = time.split(':').map(number => parseInt(number, 10));
			let status =
				resultElement
					.find('.status .rc')
					.text()
					.trim() || 'PENDING';
			let current;
			if (['FT', 'HT'].includes(status)) {
				current = status === 'FT' ? 90 : 45;
			} else if (status !== 'PENDING') {
				current = parseInt(status);
				status = 'ACTIVE';
			}
			const home = resultElement.find('.team.home .team-name').text();
			const away = resultElement.find('.team.away .team-name').text();
			const resultLinkElement = resultElement.find('.result .rc');
			const result = resultLinkElement.text();
			const link = (resultLinkElement.attr('href') || '').replace(
				/^\/Matches\/(.*)\/Live/,
				'/Matches/$1/LiveStatistics'
			);
			const [homeScore, awayScore] = result.split(':').map(score => parseInt(score, 10));
			const matchDate = new Date(date);
			matchDate.setHours(hour);
			matchDate.setMinutes(minute);
			matchDate.setSeconds(0);

			const incidentElements = resultTable.find(`.incident[data-match-id="${matchId}"]`);
			const incidents = Array.from(incidentElements)
				.map(incidentNode => {
					const incidentElement = $(incidentNode);
					const iconElement = incidentElement.find('.incidents-icon');
					const isValid = ['i-rcard', 'i-goal'].some(iconClass => iconElement.hasClass(iconClass));
					if (!isValid) {
						return null;
					}
					const incidentType = iconElement.hasClass('i-goal') ? 'goal' : 'red-card';
					const player = incidentElement.find('.player-link').text();
					const isHome =
						incidentElement
							.find('.team.home')
							.text()
							.trim() !== '';
					const goalInfo = incidentElement.find('.goal-info').text();
					const minute = parseInt(incidentElement.find('.minute').text());

					return {
						player,
						home: isHome,
						minute,
						type: incidentType,
						info: goalInfo,
					};
				})
				.filter(incident => incident);
			return {
				time: matchDate,
				home,
				away,
				homeScore,
				link,
				whoscoreLeagueId,
				league,
				awayScore,
				current,
				status,
				incidents,
			};
		});
	}

	private async waitForResults(page: SwPage) {
		await page.waitForFunction(
			selector => {
				// eslint-disable-next-line no-undef
				const element = document.querySelector(selector);
				return !element || !element.innerText.trim().startsWith('Loading');
			},
			{
				timeout: 5000,
			},
			'#countdown'
		);
	}

	async close() {
		const browser = await this.browser();
		await browser.close();
	}

	private async writeResult(relativePath, result) {
		const outputPath = path.resolve(resourcesPath, relativePath);
		await fsExtra.mkdirp(path.dirname(outputPath));
		await fsPromise.writeFile(outputPath, JSON.stringify(result, null, 4), {
			encoding: 'utf-8',
		});
	}
}
