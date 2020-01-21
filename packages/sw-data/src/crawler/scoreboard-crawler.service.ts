import https from 'https';
import { DATA_CONFIG } from '@core/config/config.constants';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { WorkerQueueService } from '@core/worker/worker-queue.service';
import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import Cheerio from 'cheerio';
import { Logger } from 'log4js';
import { Provider } from 'nconf';
import { sleep } from '@shared/lib/utils/sleep';
import { SwPage } from '@data/core/browser/browser.class';
import { ScoreboardTeam } from '@shared/lib/dtos/leagues/league-standings.dto';
import { ScoreboardPlayer } from '@shared/lib/dtos/player/player.dto';
import { ResultsService } from '@data/crawler/results.service';
import { BrowserService } from '@data/crawler/browser.service';

const MAX_ATTEMPTS = 4;
const PAGE_TIMEOUT = 60000;
const PAGE_URL = 'https://www.scoreboard.com/au/soccer';

const DATA_TIMEOUT = 30000;

@Injectable()
export class ScoreboardCrawlerService extends ResultsService {
	private axios: AxiosInstance;

	constructor(
		private readonly browserService: BrowserService,
		@Inject(DATA_CONFIG) config: Provider,
		private readonly workerQueueService: WorkerQueueService,
		@Inject(DATA_LOGGER) private readonly dataLogger: Logger
	) {
		super();
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
				const browser = await this.browserService.browser();
				page = await browser.newPage();
				await this.navigateTo(page, `${leagueUrl}standings`);
				await this.waitForTeamResult(page);
				const content = await page.content();
				await page.close();
				const $ = Cheerio.load(content);
				return {
					teams: this.parseTeams($),
					season: this.parseSeason($),
				};
			} catch (e) {
				this.dataLogger.error(`Failed to get teams for ${leagueUrl}`, e);
				if (page) {
					await page.close();
				}
			}
		}
		return {};
	}

	private parseSeason($: CheerioStatic): string {
		const text = $('#fscon > div.teamHeader > div > div.teamHeader__information > div.teamHeader__text').text();
		return text.replace('/', '-').trim();
	}

	private parseTeams($: CheerioStatic): ScoreboardTeam[] {
		const teamRows = $('#table-type-1 .table__body > .table__row');

		return Array.from(teamRows).map(teamRowNode => {
			const teamRow = $(teamRowNode);
			const teamNameElement = teamRow.find('.team_name_span');
			const teamName = teamNameElement.text();
			let teamUrl = teamNameElement.find('a').attr('onclick');
			[, teamUrl] = teamUrl.match(/javascript:getUrlByWinType\('(.*)'\)/);
			const played = parseInt(teamRow.find('.table__cell--matches_played').text(), 10);
			const wins = parseInt(teamRow.find('.table__cell--wins_regular').text(), 10);
			const draws = parseInt(teamRow.find('.table__cell--draws').text(), 10);
			const losses = parseInt(teamRow.find('.table__cell--losses_regular').text(), 10);
			const [scored, conceded] = teamRow
				.find('.table__cell--goals')
				.text()
				.split(':')
				.map(number => parseInt(number, 10));
			const points = parseInt(teamRow.find('.table__cell--points').text(), 10);
			const forms = Array.from(teamRow.find('.form__cell')).map(formNode => {
				let type;
				const formElement = $(formNode);
				if (formElement.hasClass('form__cell--win')) {
					type = 'w';
				} else if (formElement.hasClass('form__cell--loss')) {
					type = 'l';
				} else if (formElement.hasClass('form__cell--draw')) {
					type = 'd';
				} else if (formElement.hasClass('form__cell--upcoming')) {
					type = 's';
				}
				let score, date, teams;
				const title = formElement.attr('title');
				if (type === 's') {
					const matches = title.match(/\[b](.+?)\s*\[\/b](.+?)\n+(.*?)$/s);
					if (matches) {
						[, score, teams, date] = matches;
						score = score.replace(':', '');
					}
				} else {
					const matches = title.match(/\[b](.+?)\s*\[\/b]\((.+?)\)\n*(.*?)$/s);
					if (matches) {
						[, score, teams, date] = matches;
						score = score.replace('&nbsp;', '');
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
				name: teamName,
				url: teamUrl,
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

	async crawlPlayers(teamUrls: string[], season: string): Promise<{ [key: string]: ScoreboardPlayer[] }> {
		const workerQueue = this.workerQueueService.newWorker({
			worker: async () => {
				return this.axios;
			},
			logger: this.dataLogger,
		});
		const result = {};
		await workerQueue.submit(
			async (worker: AxiosInstance, link: string) => {
				for (let i = 0; i < MAX_ATTEMPTS; i++) {
					try {
						this.dataLogger.info(`Attempt ${i + 1}: Getting players for team`, link);
						const $ = await worker.get(`${link}squad`).then(({ data }) => data);
						result[link] = this.parsePlayers($, season);
						break;
					} catch (e) {
						this.dataLogger.error(`Failed to get players for team ${link}`, e);
						result[link] = null;
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

	private parsePlayers($: CheerioStatic, season: string): ScoreboardPlayer[] {
		const playerRows = $('.squad-table')
			.eq(0)
			.find('.profileTable__row.profileTable__row--between');
		return Array.from(playerRows)
			.map(playerNode => {
				const playerRow = $(playerNode);
				if (playerRow.hasClass('profileTable__row--main')) {
					return;
				}
				const jersey = parseInt(playerRow.find('.tableTeam__squadNumber').text());
				if (!jersey) {
					return;
				}
				const playerName = playerRow.find('.tableTeam__squadName a').text();
				const nationality = (playerRow.find('.tableTeam__squadName .flag').attr('title') || '').toLowerCase();
				const statCells = playerRow.find('.playerTable__sportIcon');
				const age = parseInt(statCells.eq(0).text(), 10);
				const played = parseInt(statCells.eq(1).text(), 10);
				const scored = parseInt(statCells.eq(2).text(), 10);
				const yellow = parseInt(statCells.eq(3).text(), 10);
				const red = parseInt(statCells.eq(4).text(), 10);
				const url = playerRow.find('.tableTeam__squadName a').attr('href');
				const injured = !!playerRow.find('.absence.injury').length;
				return {
					jersey,
					nationality,
					age,
					played,
					name: playerName,
					scored,
					yellow,
					red,
					status: injured ? 'injured' : 'active',
					url,
					season,
				};
			})
			.filter(val => val);
	}

	private async waitForTeamResult(page: SwPage) {
		await page.waitForSelector('#box-table-type-1', {
			visible: true,
			timeout: DATA_TIMEOUT,
		});
	}

	private async navigateTo(page: SwPage, url, options = {}) {
		page.browser().setQuiet(true);
		const result = await page.navigateTo(`${PAGE_URL}${url}`, {
			options: {
				timeout: PAGE_TIMEOUT,
				waitUntil: ['domcontentloaded'],
				...options,
			},
		});
		page.browser().setQuiet(false);
		return result;
	}
}
