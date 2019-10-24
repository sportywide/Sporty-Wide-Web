import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { PuppeteerService } from '@data/core/browser/browser.service';
import { SwBrowser, SwPage } from '@data/core/browser/browser.class';
import Cheerio from 'cheerio';
import { Logger } from 'log4js';
import { format, isSameDay } from 'date-fns';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { WorkerQueueService } from '@core/worker/worker-queue.service';
import { ResultsService } from '@data/crawler/results.service';
import { leagues as popularLeagues } from '@data/crawler/crawler.constants';
import { sleep } from '@shared/lib/utils/sleep';
import { DATA_CONFIG } from '@core/config/config.constants';
import { Provider } from 'nconf';

const popularLeagueIds = popularLeagues.map(({ whoscoreId }) => whoscoreId);

const WHOSCORE_URL = 'https://www.whoscored.com';
const PAGE_TIMEOUT = 60000;
const DATA_TIMEOUT = 30000;
const MAX_ATTEMPTS = 4;

@Injectable()
export class WhoScoreCrawlerService extends ResultsService {
	private readonly axios: AxiosInstance;
	private swBrowser: SwBrowser;
	constructor(
		private readonly puppeteerService: PuppeteerService,
		@Inject(DATA_CONFIG) private readonly config: Provider,
		private readonly workerQueueService: WorkerQueueService,
		@Inject(DATA_LOGGER) private readonly dataLogger: Logger
	) {
		super();
	}

	async browser() {
		if (this.swBrowser) {
			return this.swBrowser;
		}
		this.swBrowser = await this.puppeteerService.startBrowser({
			proxyServer: this.config.get('proxy:url'),
		});
		return this.swBrowser;
	}

	async getLiveMatches(date: Date) {
		const dateString = format(date, 'yyyy-MM-dd');
		let page;
		for (let i = 0; i < MAX_ATTEMPTS; i++) {
			try {
				this.dataLogger.info(`Attempt ${i + 1}: Getting matches for date`, dateString);
				const browser = await this.browser();
				page = await browser.newPage();
				browser.setQuiet(true);
				await this.navigateTo(page, '/LiveScores#');
				browser.setQuiet(false);
				await this.selectDate(page, date);
				const leagueMap = await this.expandIncidents(page);
				const content = await page.content();
				await page.close();
				const $ = Cheerio.load(content);
				return this.parseLiveScores($, date, leagueMap);
			} catch (e) {
				this.dataLogger.error(`Failed to get matches for ${dateString}`, e);
				if (page) {
					await page.close();
				}
			}
		}
		return [];
	}

	async getLeagues() {
		let page;
		for (let i = 0; i < MAX_ATTEMPTS; i++) {
			try {
				this.dataLogger.info(`Attempt ${i + 1}: Getting leagues`);
				const browser = await this.browser();
				page = await browser.newPage();
				browser.setQuiet(true);
				await this.navigateTo(page, '/', {
					waitUntil: ['domcontentloaded'],
				});
				browser.setQuiet(false);
				const content = await page.content();
				return this.parseLeagues(Cheerio.load(content));
			} catch (e) {
				this.dataLogger.error(`Failed to get leagues`);
				if (page) {
					await page.close();
				}
			}
		}
	}

	private parseLeagues($: CheerioStatic) {
		return Array.from($('#popular-tournaments-list > .hover-target > a'))
			.map(linkNode => {
				const link = $(linkNode);
				return link.attr('href');
			})
			.filter(link => {
				const [, leagueId] = link.match(/Regions\/\d+\/Tournaments\/(\d+)\//);
				return popularLeagueIds.includes(parseInt(leagueId, 10));
			});
	}

	private async expandIncidents(page: SwPage) {
		return page.$$eval(
			'.item .show-incidents',
			(expandArrows, popularLeagueIds) => {
				const popularLeagueMap = {};
				expandArrows.filter(expandArrow => {
					const item = expandArrow.closest('.item');
					if (!item) {
						return false;
					}
					const stageId = item.getAttribute('data-group-id');
					const stageLink = item.querySelector('.stage a');
					if (!stageLink || !stageId) {
						return false;
					}
					const link = stageLink.getAttribute('href');
					if (!link) {
						return false;
					}
					const [, leagueId] = link.match(/Regions\/\d+\/Tournaments\/(\d+)\/Seasons\/\d+\/Stages\/\d+/);
					if (!popularLeagueIds.includes(parseInt(leagueId, 10))) {
						return false;
					}
					(expandArrow as any).click();
					popularLeagueMap[stageId] = leagueId;
				});
				return popularLeagueMap;
			},
			popularLeagueIds
		);
	}

	private async selectDate(page: SwPage, date: Date) {
		const isToday = isSameDay(date, new Date());
		if (!isToday) {
			this.dataLogger.info('Select date', format(date, 'yyyy-MM-dd'));
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
		}
		await this.waitForResults(page, date, !isToday);
	}

	private parseLiveScores($: CheerioStatic, date, leagueMap): any[] {
		const resultTable = $('#livescores > table');
		const scores = resultTable.find('tr.item');
		return Array.from(scores)
			.map(node => {
				const resultElement = $(node);
				const groupId = resultElement.data('group-id');
				if (!leagueMap[groupId]) {
					return null;
				}
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
			})
			.filter(data => data);
	}

	async getRatings(matchLinks) {
		const browser = await this.browser();
		const workerQueue = this.workerQueueService.newWorker({
			worker: async () => {
				return browser.newPage();
			},
			logger: this.dataLogger,
			maximumWorkers: 3,
		});
		const result = {};
		await workerQueue.submit(
			async (page: SwPage, link: string) => {
				for (let i = 0; i < MAX_ATTEMPTS; i++) {
					try {
						this.dataLogger.info(`Attempt ${i + 1}: Getting ratings for match`, link);
						browser.setQuiet(true);
						await this.navigateTo(page, link);
						browser.setQuiet(false);
						await this.waitForRatings(page);
						const content = await page.content();
						const $ = Cheerio.load(content);
						result[link] = this.parseRatingPage($);
						break;
					} catch (e) {
						this.dataLogger.error(`Failed to get ratings for match ${link}`, e);
						if (e.nonRecoverable) {
							break;
						}
						result[link] = null;
						await sleep(1500 * (i + 1));
					}
				}
			},
			matchLinks,
			{
				limiter: 2,
				interval: 10 * 1000,
			}
		);
		return result;
	}

	private parseRatingPage($: CheerioStatic) {
		const homePlayers = $(
			'#live-player-home-summary #top-player-stats-summary-grid #player-table-statistics-body > tr'
		);
		if (homePlayers.length <= 1) {
			throw new Error('Failed to fetch data');
		}
		const awayPlayers = $(
			'#live-player-away-summary #top-player-stats-summary-grid #player-table-statistics-body > tr'
		);
		if (awayPlayers.length <= 1) {
			throw new Error('Failed to fetch data');
		}
		return {
			home: this.parseRatingTable(homePlayers, $),
			away: this.parseRatingTable(awayPlayers, $),
		};
	}

	private parseRatingTable(playerElements: Cheerio, $: CheerioStatic) {
		return Array.from(playerElements).map(playerNode => {
			const playerElement = $(playerNode);
			const playerName = playerElement
				.find('.player-link')
				.text()
				.replace(/\(.*\)/, '')
				.trim();
			const playerPosition = playerElement
				.find('.player-meta-data')
				.eq(1)
				.text()
				.replace(',', '')
				.trim();
			let rating: string | number = parseFloat(playerElement.find('.rating').text());
			if (isNaN(rating)) {
				rating = 'N/A';
			}
			const touches = parseInt(playerElement.find('.Touches').text(), 10);
			const shotsTotal = parseInt(playerElement.find('.ShotsTotal').text(), 10);
			const shotsOnTarget = parseInt(playerElement.find('.ShotOnTarget').text(), 10);
			const keyPassTotal = parseInt(playerElement.find('.KeyPassTotal').text(), 10);
			const passSuccessInMatch = parseFloat(playerElement.find('.PassSuccessInMatch').text());
			const duelAerialWon = parseInt(playerElement.find('.DuelAerialWon').text(), 10);

			return {
				name: playerName,
				position: playerPosition,
				rating,
				touches,
				shotsTotal,
				shotsOnTarget,
				keyPassTotal,
				passSuccessInMatch,
				duelAerialWon,
			};
		});
	}

	private async waitForRatings(page: SwPage) {
		await page.waitForSelector('#statistics-table-home-summary-loading', {
			timeout: DATA_TIMEOUT,
			hidden: true,
		});

		await page.waitForSelector('#statistics-table-away-summary-loading', {
			timeout: DATA_TIMEOUT,
			hidden: true,
		});
	}

	private async navigateTo(page: SwPage, url, options = {}) {
		const response = await page.navigateTo(`${WHOSCORE_URL}${url}`, {
			cookieSelector: '#qcCmpButtons > button:nth-child(2)',
			options: {
				timeout: PAGE_TIMEOUT,
				waitUntil: ['domcontentloaded', 'networkidle2'],
				...options,
			},
		});

		if (response!.status() === 403) {
			throw new Error(`Failed to access page ${url}`);
		}
		if (page.url().includes('404.html')) {
			throw new NonRecoverable('404');
		}
		return response;
	}

	private async waitForResults(page: SwPage, date: Date, waitForResponse) {
		if (waitForResponse) {
			await page.waitForResponse(response => {
				return (
					response.url().startsWith(`${WHOSCORE_URL}/matchesfeed/?d=${format(date, 'yyyyMMdd')}`) &&
					response.status() === 200
				);
			});
		}

		await page.waitForFunction(
			selector => {
				// eslint-disable-next-line no-undef
				const element = document.querySelector(selector);
				const text = (element && element.innerText.trim()) || '';
				if (text.startsWith('Unable')) {
					throw new Error('Failed to do xhr request');
				}
				return !text || !text.startsWith('Loading');
			},
			{
				timeout: DATA_TIMEOUT,
			},
			'#countdown'
		);
	}

	async close() {
		const browser = await this.browser();
		await browser.close();
	}
}

class NonRecoverable extends Error {
	nonRecoverable: boolean;

	constructor(message) {
		super(message);
		this.nonRecoverable = true;
	}
}
