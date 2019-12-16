import { DATA_CONFIG } from '@core/config/config.constants';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { WorkerQueueService } from '@core/worker/worker-queue.service';
import { SwPage } from '@data/core/browser/browser.class';
import { Inject, Injectable } from '@nestjs/common';
import { leagues as popularLeagues } from '@shared/lib/data/data.constants';
import { sleep } from '@shared/lib/utils/sleep';
import { AxiosInstance } from 'axios';
import Cheerio from 'cheerio';
import { format, isSameDay, parse } from 'date-fns';
import { Logger } from 'log4js';
import { Provider } from 'nconf';
import { ResultsService } from '@data/crawler/results.service';
import { BrowserService } from '@data/crawler/browser.service';
import { keyBy, last, sum } from 'lodash';
import { nothing } from '@shared/lib/utils/functions';
import { WhoscoreFixture } from '@shared/lib/dtos/fixture/fixture.dto';
import { WhoscorePlayerRating } from '@shared/lib/dtos/player/player-rating.dto';

const popularLeagueIds = popularLeagues.map(({ whoscoreId }) => whoscoreId);
const whoscoreLeagueMap = keyBy(popularLeagues, 'whoscoreId');

const WHOSCORE_URL = 'https://www.whoscored.com';
const PAGE_TIMEOUT = 60000;
const DATA_TIMEOUT = 30000;
const MAX_ATTEMPTS = 4;

@Injectable()
export class WhoScoreCrawlerService extends ResultsService {
	private readonly axios: AxiosInstance;

	constructor(
		@Inject(DATA_CONFIG) config: Provider,
		private readonly workerQueueService: WorkerQueueService,
		@Inject(DATA_LOGGER) private readonly dataLogger: Logger,
		private readonly browserService: BrowserService
	) {
		super();
	}

	async getLiveMatches(date: Date) {
		const dateString = format(date, 'yyyy-MM-dd');
		let page;
		for (let i = 0; i < MAX_ATTEMPTS; i++) {
			try {
				this.dataLogger.info(`Attempt ${i + 1}: Getting matches for date`, dateString);
				const browser = await this.browserService.browser();
				page = await browser.newPage();
				await this.navigateTo(page, '/LiveScores#');
				await this.selectDate(page, date);
				await this.expandLiveScoreIncidents(page);
				const leagueMap = await this.getPopularLeagueMap(page);
				const content = await page.content();
				await page.close();
				const $ = Cheerio.load(content);
				return this.parseLiveScores($, date, leagueMap);
			} catch (e) {
				this.dataLogger.error(`Failed to get matches for ${dateString}`, e);
				if (page) {
					await page.close();
				}
				await sleep(1500 * (i + 1));
			}
		}
		return [];
	}

	async getLeagues() {
		let page;
		for (let i = 0; i < MAX_ATTEMPTS; i++) {
			try {
				this.dataLogger.info(`Attempt ${i + 1}: Getting leagues`);
				const browser = await this.browserService.browser();
				page = await browser.newPage();
				await this.navigateTo(page, '/', {
					waitUntil: ['domcontentloaded'],
				});
				const content = await page.content();
				return this.parseLeagues(Cheerio.load(content));
			} catch (e) {
				this.dataLogger.error(`Failed to get leagues`, e);
				if (page) {
					await page.close();
				}
			}
		}
	}

	async getMonthlyFixtures(leagueUrl) {
		let page;
		for (let i = 0; i < MAX_ATTEMPTS; i++) {
			try {
				this.dataLogger.info(`Attempt ${i + 1}: Getting monthly fixture ${leagueUrl}`);
				const browser = await this.browserService.browser();
				page = await browser.newPage();
				await this.navigateTo(page, leagueUrl, {
					waitUntil: ['domcontentloaded'],
				});
				const fixtureLink = await page.$eval('#sub-navigation > ul > li:nth-child(2) > a', element => {
					return element.getAttribute('href');
				});
				await this.navigateTo(page, fixtureLink, {
					waitUntil: ['domcontentloaded'],
				});
				await page.waitForSelector('#tournament-fixture', {
					visible: true,
					timeout: DATA_TIMEOUT,
				});
				await this.expandFixtureIncidents(page);
				const content = await page.content();
				let [, leagueId] = leagueUrl.match(/Regions\/\d+\/Tournaments\/(\d+)\//);
				leagueId = parseInt(leagueId, 10);
				return this.parseFixtureTable(leagueId, Cheerio.load(content));
			} catch (e) {
				this.dataLogger.error(`Failed to get leagues`, e);
				if (page) {
					await page.close();
				}
			}
		}
	}

	private async expandFixtureIncidents(page: SwPage) {
		const linkHandles = await page.$$('.item .show-incidents');
		await Promise.all(
			linkHandles.map(async linkHandle => {
				const matchId = await linkHandle.evaluate((element: any) => {
					element.click();
					return element.closest('.item').getAttribute('data-id');
				});
				return page
					.waitForResponse(`${WHOSCORE_URL}/matchesfeed/${matchId}/IncidentsSummary/`)
					.then(nothing, nothing);
			})
		);
	}

	private parseFixtureTable(leagueId: number, $: CheerioStatic): WhoscoreFixture[] {
		const fixtureTable = $('#tournament-fixture');
		const fixtureRows = fixtureTable.find('tr.item');
		return Array.from(fixtureRows).map(fixtureNode => {
			const fixtureElement = $(fixtureNode);
			const dateElement = fixtureElement
				.prevUntil('.rowgroupheader')
				.last()
				.prev();
			const dateStr = dateElement.find('th').text();
			const date = parse(dateStr, 'EEEE, MMM d yyyy', new Date());
			const matchDetails = this.parseMatchDetails(fixtureElement, date);
			const matchId = fixtureElement.data('id');
			const incidents = this.parseIncident($, fixtureTable, `m${matchId}`);

			return {
				...matchDetails,
				whoscoreLeagueId: leagueId,
				incidents,
			};
		});
	}

	private parseLeagues($: CheerioStatic) {
		return Array.from($('#popular-tournaments-list > .hover-target > a'))
			.map(linkNode => {
				const link = $(linkNode);
				return link.attr('href');
			})
			.map(link => {
				const [, leagueId] = link.match(/Regions\/\d+\/Tournaments\/(\d+)\//);
				const whoscoreLeagueId = parseInt(leagueId, 10);
				if (!whoscoreLeagueMap[whoscoreLeagueId]) {
					return;
				}
				return {
					link,
					league: whoscoreLeagueMap[whoscoreLeagueId],
				};
			})
			.filter(data => data);
	}

	private async getPopularLeagueMap(page: SwPage) {
		return page.$$eval(
			'.group .group-name-container .tournament-link',
			(groups, popularLeagueIds) => {
				const popularLeagueMap = {};
				groups.forEach(group => {
					const link = group.getAttribute('href');
					if (!link) {
						return false;
					}
					const [, leagueId, stageId] = link.match(
						/Regions\/\d+\/Tournaments\/(\d+)\/Seasons\/\d+\/Stages\/(\d+)/
					);
					if (!popularLeagueIds.includes(parseInt(leagueId, 10))) {
						return false;
					}
					popularLeagueMap[stageId] = leagueId;
				});
				return popularLeagueMap;
			},
			popularLeagueIds
		);
	}

	private async expandLiveScoreIncidents(page: SwPage) {
		return page.$$eval(
			'.item .show-incidents',
			(expandArrows, popularLeagueIds) => {
				expandArrows.forEach(expandArrow => {
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
				});
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

	private parseLiveScores($: CheerioStatic, date, leagueMap): WhoscoreFixture[] {
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
				const matchDetails = this.parseMatchDetails(resultElement, date);
				const incidents = this.parseIncident($, resultTable, matchId);
				return {
					...matchDetails,
					whoscoreLeagueId: parseInt(whoscoreLeagueId),
					incidents,
				};
			})
			.filter(data => data);
	}

	private parseMatchDetails(matchElement, date) {
		const time = matchElement.find('td.time').text();
		const [hour, minute] = time.split(':').map(number => parseInt(number, 10));
		let status =
			matchElement
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
		const home = matchElement.find('.team.home .team-link').text();
		const away = matchElement.find('.team.away .team-link').text();
		const resultLinkElement = matchElement.find('.result .rc');
		const result = resultLinkElement.text();
		const link = (resultLinkElement.attr('href') || '').replace(
			/^\/Matches\/(.*)\/(Live|Show|LiveStatistics)/,
			'/Matches/$1/Live'
		);
		let homeScore = 0,
			awayScore = 0;
		if (status !== 'PENDING') {
			[homeScore, awayScore] = result.split(':').map(score => parseInt(score, 10));
		}
		const matchDate = new Date(date);
		matchDate.setHours(hour);
		matchDate.setMinutes(minute);
		matchDate.setSeconds(0);

		return {
			time: matchDate,
			home,
			away,
			homeScore,
			link,
			awayScore,
			current: current || 0,
			status,
		};
	}

	private parseIncident($: CheerioStatic, tableElement, matchId) {
		const incidentElements = tableElement.find(`.incident[data-match-id="${matchId}"]`);
		return Array.from(incidentElements)
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
	}

	async getRatings(matchLinks) {
		const browser = await this.browserService.browser();
		const workerQueue = this.workerQueueService.newWorker({
			worker: async () => {
				return browser.newPage();
			},
			logger: this.dataLogger,
			maximumWorkers: 3,
		});
		const result: { [key: string]: { home: WhoscorePlayerRating[]; away: WhoscorePlayerRating[] } } = {};
		await workerQueue.submit(
			async (page: SwPage, link: string) => {
				for (let i = 0; i < MAX_ATTEMPTS; i++) {
					try {
						this.dataLogger.info(`Attempt ${i + 1}: Getting ratings for match`, link);
						await this.navigateTo(page, link);
						await this.waitForRatings(page);
						const matchCentreData = await page.evaluate(() => {
							// eslint-disable-next-line no-undef
							return (window as any).matchCentreData;
						});
						result[link] = this.parseMatchRatings(matchCentreData);
						break;
					} catch (e) {
						this.dataLogger.error(`Failed to get ratings for match ${link}`, e);
						result[link] = null;
						if (e.nonRecoverable) {
							break;
						}
						await sleep(1500 * (i + 1));
					}
				}
			},
			matchLinks,
			{
				limiter: 3,
				interval: 10 * 1000,
			}
		);
		return result;
	}

	private parseMatchRatings(matchCenterData) {
		return {
			home: this.parsePlayerRatings(matchCenterData.home),
			away: this.parsePlayerRatings(matchCenterData.away),
		};
	}

	private parsePlayerRatings(teamData): WhoscorePlayerRating[] {
		return Array.from(teamData.players)
			.map((playerData: any) => {
				const stats = playerData.stats;
				if (!Object.values(stats).length) {
					return null;
				}
				return {
					name: playerData.name,
					position: playerData.position,
					shirt: playerData.shirtNo,
					rating: last<number>(Object.values(stats.ratings || {})) || -1,
					touches: sum(Object.values(stats.touches || {})),
					shotsTotal: sum(Object.values(stats.shotsTotal || {})),
					shotsOffTarget: sum(Object.values(stats.shotsOffTarget || {})),
					tacklesTotal: sum(Object.values(stats.tacklesTotal || {})),
					tackleSuccessful: sum(Object.values(stats.tackleSuccessful || {})),
					keyPassTotal: sum(Object.values(stats.passesKey || {})),
					totalPasses: sum(Object.values(stats.passesTotal || {})),
					passesAccurate: sum(Object.values(stats.passesAccurate || {})),
					duelAerialTotal: sum(Object.values(stats.aerialsTotal || {})),
					duelAerialWon: sum(Object.values(stats.aerialsWon || {})),
				};
			})
			.filter(data => data);
	}

	private async waitForRatings(page: SwPage) {
		const status = await page.$eval('#match-header > table > tbody dl > dd.status > span', element =>
			element.textContent.trim()
		);
		if (status !== 'FT') {
			throw new NonRecoverable('Match not finished');
		}
		await page.waitForSelector('#live-match', {
			timeout: DATA_TIMEOUT,
			visible: true,
		});
	}

	private async navigateTo(page: SwPage, url, options = {}) {
		page.browser().setQuiet(true);
		const response = await page.navigateTo(`${WHOSCORE_URL}${url}`, {
			cookieSelector: '#qcCmpButtons > button:nth-child(2)',
			options: { timeout: PAGE_TIMEOUT, waitUntil: ['domcontentloaded'], ...options },
		});

		if (response && response.status() === 403) {
			throw new Error(`Failed to access page ${url}`);
		}
		if (page.url().includes('404.html')) {
			throw new NonRecoverable('404');
		}
		page.browser().setQuiet(true);
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
}

class NonRecoverable extends Error {
	nonRecoverable: boolean;

	constructor(message) {
		super(message);
		this.nonRecoverable = true;
	}
}
