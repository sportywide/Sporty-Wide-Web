import https from 'https';
import { DATA_CONFIG } from '@core/config/config.constants';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { WorkerQueueService } from '@core/worker/worker-queue.service';
import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import Cheerio from 'cheerio';
import { Logger } from 'log4js';
import { Provider } from 'nconf';
import { keyBy } from 'lodash';
import { PuppeteerService } from '../core/browser/browser.service';
import { sleep } from './../../../sw-shared/src/lib/utils/sleep';
import { SwPage } from './../core/browser/browser.class';
import { BrowserService } from './browser.service';
const MAX_ATTEMPTS = 4;
const PAGE_TIMEOUT = 60000;
const PAGE_URL = 'https://www.scoreboard.com/au/soccer';

const DATA_TIMEOUT = 30000;

@Injectable()
export class TeamPlayerScoreboardCrawlerService extends BrowserService {
	private axios: AxiosInstance;

	constructor(
		puppeteerService: PuppeteerService,
		@Inject(DATA_CONFIG) config: Provider,
		private readonly workerQueueService: WorkerQueueService,
		@Inject(DATA_LOGGER) private readonly dataLogger: Logger
	) {
		super(puppeteerService, config);
		this.axios = axios.create({
			baseURL: 'https://www.scoreboard.com/',
			transformResponse: (data, headers) => {
				const contentType = headers['content-type'];
				if (contentType && contentType.includes('text/html')) {
					return Cheerio.load(data);
				}
				return data;
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		});
	}

	async crawlTeams(leagueUrl) {
		let page: SwPage | null = null;
		for (let i = 0; i < MAX_ATTEMPTS; i++) {
			try {
				this.dataLogger.info(`Attempt ${i + 1}: Getting teams for league`, leagueUrl);
				const browser = await this.browser();
				page = await browser.newPage();
				browser.setQuiet(true);
				await this.navigateTo(page, `${leagueUrl}standings`);
				browser.setQuiet(false);
				await this.waitForTeamResult(page);
				const content = await page.content();
				await page.close();
				const $ = Cheerio.load(content);
				return this.parseTeams($);
			} catch (e) {
				this.dataLogger.error(`Failed to get teams for ${leagueUrl}`, e);
				if (page) {
					await page.close();
				}
			}
		}
	}

	private parseTeams($: CheerioStatic) {
		const teamRows = $('#table-type-1 > tbody > tr');

		return Array.from(teamRows).map(teamRowNode => {
			const teamRow = $(teamRowNode);
			const teamNameElement = teamRow.find('.team_name_span');
			const teamName = teamNameElement.text();
			let teamUrl = teamNameElement.find('a').attr('onclick');
			[, teamUrl] = teamUrl.match(/javascript:getUrlByWinType\('(.*)'\)/);
			const played = parseInt(teamRow.find('.matches_played').text(), 10);
			const wins = parseInt(teamRow.find('.wins_regular').text(), 10);
			const draws = parseInt(teamRow.find('.draws').text(), 10);
			const losses = parseInt(teamRow.find('.losses_regular').text(), 10);
			const [scored, conceded] = teamRow
				.find('.goals')
				.text()
				.split(':')
				.map(number => parseInt(number, 10));
			const points = parseInt(teamRow.find('.points').text(), 10);
			const forms = Array.from(teamRow.find('.form-bg')).map(formNode => {
				let type;
				const formElement = $(formNode);
				if (formElement.hasClass('form-w')) {
					type = 'w';
				} else if (formElement.hasClass('form-l')) {
					type = 'l';
				} else if (formElement.hasClass('form-d')) {
					type = 'd';
				} else if (formElement.hasClass('form-s')) {
					type = 's';
				}
				let score, date, teams;
				const title = formElement.attr('title');
				if (type === 's') {
					const matches = title.match(/\[b\](.+?)\s*\[\/b\](.+?)\n+(.*?)$/s);
					if (matches) {
						[, score, teams, date] = matches;
					}
				} else {
					const matches = title.match(/\[b\](.+?)\s*\[\/b\]\((.+?)\)\n*(.*?)$/s);
					if (matches) {
						[, score, teams, date] = matches;
					}
				}

				return {
					type,
					teams: teams ? teams.trim() : undefined,
					score: score ? score.trim() : undefined,
					date: date ? date.trim() : undefined,
				};
			});
			return {
				teamName,
				teamUrl,
				played,
				wins,
				draws,
				losses,
				scored,
				conceded,
				points,
				forms,
			};
		});
	}

	async crawlPlayers(teams: { url: string; id: any }[]) {
		const teamUrls = teams.map(team => team.url);
		const teamUrlMap = keyBy(teams, 'url');
		const workerQueue = this.workerQueueService.newWorker({
			worker: async () => {
				return this.axios;
			},
			logger: this.dataLogger,
		});
		const result = {};
		await workerQueue.submit(
			async (worker: AxiosInstance, link: string) => {
				const id = teamUrlMap[link].id;
				for (let i = 0; i < MAX_ATTEMPTS; i++) {
					try {
						this.dataLogger.info(`Attempt ${i + 1}: Getting players for team`, link);
						const $ = await worker.get(`${link}squad`).then(({ data }) => data);
						result[id] = this.parsePlayers($);
						break;
					} catch (e) {
						this.dataLogger.error(`Failed to get players for team ${link}`, e);
						result[id] = null;
						await sleep(1500 * (i + 1));
					}
				}
			},
			teamUrls,
			{
				limiter: 10,
				interval: 15 * 1000,
			}
		);
		return result;
	}

	private parsePlayers($: CheerioStatic) {
		const playerRows = $('#fsbody > table > tbody > tr.player');
		return Array.from(playerRows).map(playerNode => {
			const playerRow = $(playerNode);
			const jersey = parseInt(playerRow.find('.jersey-number').text());
			const playerName = playerRow.find('.player-name a').text();
			const nationality = (playerRow.find('.player-name .flag').attr('title') || '').toLowerCase();
			const age = parseInt(playerRow.find('.player-age').text(), 10);
			const tds = playerRow.find('td');
			const played = parseInt(tds.eq(3).text(), 10);
			const scored = parseInt(tds.eq(4).text(), 10);
			const yellow = parseInt(tds.eq(5).text(), 10);
			const red = parseInt(tds.eq(6).text(), 10);
			const injured = !!playerRow.find('.absence.injury').length;
			return {
				jersey,
				nationality,
				age,
				played,
				playerName,
				scored,
				yellow,
				red,
				status: injured ? 'injured' : 'active',
			};
		});
	}

	private async waitForTeamResult(page: SwPage) {
		await page.waitForSelector('#glib-stats-data > div.preload', {
			hidden: true,
			timeout: DATA_TIMEOUT,
		});
	}

	private async navigateTo(page: SwPage, url, options = {}) {
		const response = await page.navigateTo(`${PAGE_URL}${url}`, {
			options: {
				timeout: PAGE_TIMEOUT,
				waitUntil: ['domcontentloaded', 'networkidle2'],
				...options,
			},
		});
		return response;
	}
}