import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { PuppeteerService } from '@data/core/browser/browser.service';
import { SwBrowser, SwPage } from '@data/core/browser/browser.class';
import Cheerio from 'cheerio';
import { Logger } from 'log4js';
import { format } from 'date-fns';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { WorkerQueueService } from '@core/worker/worker-queue.service';
import { ResultsService } from '@data/crawler/results.service';
import { leagues as popularLeagues } from '@data/crawler/crawler.constants';
const popularLeagueIds = popularLeagues.map(({ whoscoreId }) => whoscoreId);

const WHOSCORE_URL = 'https://www.whoscored.com';
@Injectable()
export class ScoreCrawlerService extends ResultsService {
	private readonly axios: AxiosInstance;
	private swBrowser: SwBrowser;
	constructor(
		private readonly puppeteerService: PuppeteerService,
		private readonly workerQueueService: WorkerQueueService,
		@Inject(DATA_LOGGER) private readonly dataLogger: Logger
	) {
		super();
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
		await this.navigateTo(page, '/LiveScores#');
		browser.setQuiet(false);
		await this.waitForResults(page);
		await this.selectDate(page, date);
		const leagueMap = await this.expandIncidents(page);
		const content = await page.content();
		await page.close();
		const $ = Cheerio.load(content);
		return this.parseLiveScores($, date, leagueMap);
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
				try {
					this.dataLogger.info('Getting ratings for match', link);
					browser.setQuiet(true);
					await this.navigateTo(page, link);
					browser.setQuiet(false);
					await this.waitForRatings(page);
					const content = await page.content();
					const $ = Cheerio.load(content);
					result[link] = this.parseRatingPage($);
				} catch (e) {
					this.dataLogger.error(`Failed to get ratings for match ${link}`, e);
					result[link] = null;
				}
			},
			matchLinks,
			{
				limiter: 2,
				interval: 30 * 1000,
			}
		);
		return result;
	}

	private parseRatingPage($: CheerioStatic) {
		const homePlayers = $(
			'#live-player-home-summary #top-player-stats-summary-grid #player-table-statistics-body > tr'
		);
		const awayPlayers = $(
			'#live-player-away-summary #top-player-stats-summary-grid #player-table-statistics-body > tr'
		);
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
			timeout: 10000,
			hidden: true,
		});

		await page.waitForSelector('#statistics-table-away-summary-loading', {
			timeout: 10000,
			hidden: true,
		});
	}

	private navigateTo(page: SwPage, url) {
		return page.navigateTo(`${WHOSCORE_URL}${url}`, {
			cookieSelector: '#qcCmpButtons > button:nth-child(2)',
			options: {
				waitUntil: ['domcontentloaded'],
			},
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
				timeout: 10000,
			},
			'#countdown'
		);
	}

	async close() {
		const browser = await this.browser();
		await browser.close();
	}
}
