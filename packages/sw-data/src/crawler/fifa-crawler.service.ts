import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'log4js';
import cheerio from 'cheerio';
import { range } from '@shared/lib/utils/array/range';
import { sleep } from '@shared/lib/utils/sleep';
import { chunk, flattenDeep } from 'lodash';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { ResultsService } from '@data/crawler/results.service';
import { unaccent } from '@shared/lib/utils/string/conversion';
import { teamAliasMapping, teamMapping } from '@shared/lib/data/data.constants';

const cloudscraper = require('cloudscraper');
const MAX_ATTEMPTS = 4;

const DEFAULT_PLAYER_PAGES = 5;

export type FifaTeam = {
	fifaId: number;
	image: string;
	title: string;
	name: string;
	league: {
		title: string;
		fifaId: number;
	};
	alias: string[];
	att: number;
	mid: number;
	def: number;
	rating: number;
	ovr: number;
};

export type FifaPlayer = {
	fifaId: number;
	shirt: number;
	image: string;
	nationality: {
		title: string;
		fifaId: number;
	};
	rating: number;
	name: string;
	url: string;
	positions: string[];
	age: number;
	team: {
		title: string;
		fifaId: number;
	};
};

@Injectable()
export class FifaCrawlerService extends ResultsService {
	private _fifaRegex = /\s*fifa\s*\d*/gim;

	constructor(@Inject(DATA_LOGGER) private readonly logger: Logger) {
		super();
	}

	// region crawl by league
	async crawlTeamsByLeague(leagueId: number): Promise<FifaTeam[]> {
		this.logger.info(`Fetching teams of league id ${leagueId}`);
		const url = `/teams?league=${leagueId}&order=desc`;
		const $ = await this.getParsedResponse(url);
		return this.parseInfoTeamsOfLeague($);
	}

	private parseInfoTeamsOfLeague($: CheerioStatic): FifaTeam[] {
		const result: FifaTeam[] = [];
		const rows = $('table tbody tr');
		rows.each((i, row) => {
			// Invalid row
			if (row.children.length === 0) {
				return;
			}

			const rowAttrs = $(row).attr();
			if (!!rowAttrs && !!rowAttrs['class'] && rowAttrs['class'].indexOf('none') >= 0) {
				return;
			}

			// Valid row
			const columns = $(row).find('td');

			const image = columns
				.eq(0)
				.find('img')
				.attr();
			const bio = columns
				.eq(1)
				.find('a')
				.attr();

			const league = columns
				.eq(2)
				.find('a')
				.attr();

			const att = columns.eq(3);
			const mid = columns.eq(4);
			const def = columns.eq(5);
			const ovr = columns.eq(6);

			// Ratio - content as `{active} / {max}`
			const span = columns.eq(7).find('span.star');
			const maxStars = span.find('i').length;
			const activeStars = span.find('i.fas.fa-star').length;
			const halfStars = span.find('i.fas.fa-star-half-alt').length;
			const rating = `${activeStars + halfStars / 2}/${maxStars}`;

			const title = this.cleanTeamTitle(bio['title']);
			result.push({
				fifaId: parseInt(bio['href'].split('/').filter(s => !!s)[1], 10),
				image: image['data-src'],
				title: teamMapping[title] || title,
				name: bio['href'].split('/').filter(s => !!s)[2],
				league: {
					title: league['title'].replace(this._fifaRegex, '').trim(),
					fifaId: parseInt(league['href'].split('league=')[1], 10),
				},
				alias: !teamMapping[title] ? [] : teamAliasMapping[teamMapping[title]],
				[att.attr('data-title').toLowerCase()]: parseInt(att.eq(0).text(), 10),
				[mid.attr('data-title').toLowerCase()]: parseInt(mid.eq(0).text(), 10),
				[def.attr('data-title').toLowerCase()]: parseInt(def.eq(0).text(), 10),
				[ovr.attr('data-title').toLowerCase()]: parseInt(ovr.eq(0).text(), 10),
				rating: parseFloat(rating),
			} as FifaTeam);
		});

		return result;
	}

	async crawlPlayersByTeams(teamIds: number[]): Promise<FifaPlayer[]> {
		this.logger.info(`Fetching new batch of players`);
		const players: FifaPlayer[] = [];

		const teamChunks = chunk(teamIds, 5);

		for (const chunk of teamChunks) {
			await Promise.all(
				chunk.map(async teamId => {
					for (let i = 0; i < MAX_ATTEMPTS; i++) {
						try {
							this.logger.info(`Attempt ${i + 1}: Fetching team ${teamId}`);
							const teamUrl = `/team/${teamId}`;
							const $ = await this.getParsedResponse(teamUrl);
							const playersOfTeam = this.parseInfoPlayersOfTeam($, teamId);
							players.push(...playersOfTeam);
							return;
						} catch (e) {
							this.logger.info(`Failed to get team ${teamId}`, e);
							await sleep(1500 * (i + 1));
						}
					}
				})
			);
			await sleep(1000);
		}

		return players;
	}

	private parseInfoPlayersOfTeam($, teamId): FifaPlayer[] {
		const teamName = $('title')
			.text()
			.split('- FIFA ')[0]
			.trim();
		const rows = $('div.responsive-table table')
			.first()
			.find('tbody tr');
		const result: FifaPlayer[] = [];
		rows.each((i, row) => {
			const shirt = $($(row).find('td[data-title="Kit Number"]')).text();

			const $name = $($(row).find('td[data-title="Name"] a'));
			const url = $name.attr()['href'];
			const name = $name
				.contents()
				.first()
				.text();

			const image = $($(row).find('td a img')).attr()['data-src'];

			const rating = $($(row).find('td[data-title="OVR / POT"] span'))
				.eq(0)
				.text();

			const $nationality = $($(row).find('td[data-title="Nationality"] a'));
			const nationalityId = $nationality.attr()['href'].split('nationality=')[1];
			const nationality = $nationality.attr()['title'];

			const age = $($(row).find('td[data-title="Age"]')).text();

			const positions: string[] = [];
			const positionLinks = $($(row).find('td[data-title="Preferred Positions"] a span'));
			positionLinks.each((pli, positionLink) => {
				positions.push($(positionLink).text());
			});

			result.push({
				fifaId: parseInt(url.split('/').filter(s => !!s)[1], 10),
				shirt,
				image,
				nationality: {
					title: nationality,
					fifaId: parseInt(nationalityId, 10),
				},
				rating: parseInt(rating, 10),
				name,
				url,
				positions,
				age: parseInt(age, 10),
				team: {
					title: teamName,
					fifaId: teamId,
				},
			});
		});
		return result;
	}
	// endregion

	// region Crawl teams
	async crawlTeam(leagueId): Promise<FifaTeam[]> {
		this.logger.info(`Fetching league id ${leagueId}`);
		const url = `/teams?league=${leagueId}&order=desc`;
		const result = await this.getParsedResponse(url);
		return this.parseInfoTeam(result);
	}

	private parseInfoTeam($: CheerioStatic): FifaTeam[] {
		const result: any[] = [];
		const rows = $('table.table-teams tbody tr');
		rows.each((i, row) => {
			const columns = $(row).find('td');
			if (columns.length <= 1) {
				return;
			}

			const image = columns
				.eq(0)
				.find('img')
				.attr();
			const teamLink = columns.eq(1).find('a');

			const league = columns
				.eq(2)
				.find('a')
				.attr();

			const att = columns.eq(3);
			const mid = columns.eq(4);
			const def = columns.eq(5);
			const ovr = columns.eq(6);

			// Ratio - content as `{active} / {max}`
			const span = columns.eq(7).find('span.star');
			const maxStars = span.find('i').length;
			const activeStars = span.find('i.fas.fa-star').length;
			const halfStars = span.find('i.fas.fa-star-half-alt').length;
			const rating = `${activeStars + halfStars / 2}/${maxStars}`;

			const title = teamLink.text();
			result.push({
				fifaId: parseInt(
					teamLink
						.attr('href')
						.split('/')
						.filter(s => !!s)[1],
					10
				),
				image: image['data-src'],
				title: teamMapping[title] || title,
				name: teamLink
					.attr('href')
					.split('/')
					.filter(s => !!s)[2],
				league: {
					title: league['title'].replace(this._fifaRegex, '').trim(),
					fifaId: parseInt(league['href'].split('league=')[1], 10),
				},
				alias: !teamMapping[title] ? [] : teamAliasMapping[teamMapping[title]],
				[att.attr('data-title').toLowerCase()]: parseInt(att.eq(0).text(), 10),
				[mid.attr('data-title').toLowerCase()]: parseInt(mid.eq(0).text(), 10),
				[def.attr('data-title').toLowerCase()]: parseInt(def.eq(0).text(), 10),
				[ovr.attr('data-title').toLowerCase()]: parseInt(ovr.eq(0).text(), 10),
				rating,
			});
		});

		return result;
	}
	// endregion Crawl teams

	// region Crawl from listing page
	async crawlPlayers(leagueId): Promise<FifaPlayer[]> {
		this.logger.info(`Fetching players for league id ${leagueId}`);
		const result: any[] = [];
		let shouldContinue = true;
		let currentPage = 1;
		do {
			const responses = await this.crawlPlayersBatchPages(leagueId, currentPage, DEFAULT_PLAYER_PAGES);
			shouldContinue = responses.every(({ error, response }) => !error || response.status !== 404);
			result.push(...flattenDeep(responses.filter(({ error }) => !error).map(({ response }) => response)));
			currentPage += DEFAULT_PLAYER_PAGES;
			await sleep(1000);
		} while (shouldContinue);

		return result;
	}

	private async crawlPlayersBatchPages(leagueId, start, count): Promise<{ error: boolean; response: any }[]> {
		this.logger.info(`Fetching ${count} players page for league ${leagueId} starting from ${start}`);
		return Promise.all(
			range(start, start + count).map(page =>
				this.crawlPlayerPage(leagueId, page)
					.then(playerData => {
						this.logger.info(`Successfully fetched player page ${page} for league id ${leagueId}`);
						return { error: false, response: playerData };
					})
					.catch(error => {
						this.logger.error(
							`Failed to fetch player page ${page} for league id ${leagueId}`,
							(error.response && error.response.status) || error.message
						);
						return { error: true, response: error.response };
					})
			)
		);
	}

	private async crawlPlayerPage(leagueId: string, page: number) {
		this.logger.info(`Fetching player page ${page} for league id ${leagueId}`);
		const url = `/players/${page}/?league=${leagueId}&order=desc`;
		const result = await this.getParsedResponse(url);
		return this.parseInfoBulk(result);
	}

	private async parseInfoBulk($: CheerioStatic): Promise<FifaPlayer[]> {
		const result: any[] = [];
		const rows = $('table tbody tr');

		rows.each((i, row) => {
			const columns = $(row).find('td');
			if (columns.length <= 1) {
				return;
			}

			const image = columns
				.eq(0)
				.find('img')
				.attr();
			const nationality = columns
				.eq(1)
				.find('a')
				.attr();
			const rating = columns
				.eq(2)
				.find('span')
				.eq(0)
				.text();

			const bio = columns
				.eq(3)
				.find('a')
				.attr();

			const positions: string[] = [];
			const positionLinks = columns.eq(4).find('a');
			positionLinks.each((pli, positionLink) => {
				positions.push($(positionLink).text());
			});

			const age = columns
				.eq(5)
				.eq(0)
				.text();

			const club = columns
				.eq(7)
				.find('a')
				.attr();

			const teamTitle = this.cleanTeamTitle(club['title']);

			result.push({
				fifaId: parseInt($(row).attr('data-playerid'), 10),
				image: image['data-src'],
				nationality: {
					title: nationality['title'],
					fifaId: parseInt(nationality['href'].split('nationality=')[1], 10),
				},
				rating: parseInt(rating, 10),
				name: bio['title'].replace(this._fifaRegex, '').trim(),
				url: bio['href'],
				positions,
				age: parseInt(age, 10),
				team: {
					title: teamMapping[teamTitle] || teamTitle,
					fifaId: parseInt(club['href'].split('/').filter(s => !!s)[1], 10),
				},
			});
		});

		return result;
	}
	// endregion Crawl from listing page

	// region Crawl from detail page
	async crawlPlayerLimitedDetail(playerId: number): Promise<any> {
		const $ = await this.getParsedResponse(`player/${playerId}`);
		const tag = $('div.container div.card div.card-body p:contains("Kit Number") span');
		const shirt = !!tag ? parseInt(tag.last().text(), 10) : null;
		return { shirt };
	}

	private cleanTeamTitle(title) {
		return unaccent(
			title
				.replace(this._fifaRegex, '')
				.replace(/\d+./, '')
				.trim()
		);
	}
	// endregion Crawl from detail page

	private getParsedResponse(url) {
		return cloudscraper.get(`https://www.fifaindex.com${url}`).then(data => cheerio.load(data));
	}
}
