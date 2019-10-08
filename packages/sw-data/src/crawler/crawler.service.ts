import path from 'path';
import https from 'https';
import { fsPromise } from '@shared/lib/utils/promisify/fs';
import fsExtra from 'fs-extra';
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import cheerio from 'cheerio';
import { range } from '@shared/lib/utils/array/range';
import { sleep } from '@shared/lib/utils/sleep';
import { flattenDeep } from 'lodash';

const resourcesPath = path.resolve(process.cwd(), 'resources');
const DEFAULT_PLAYER_PAGES = 5;

@Injectable()
export class CrawlerService {
	private _fifaRegex = /\s*fifa\s*\d*/gim;

	private axios: AxiosInstance;

	constructor() {
		this.axios = axios.create({
			baseURL: 'https://www.fifaindex.com',
			transformResponse: (data, headers) => {
				const contentType = headers['content-type'];
				if (contentType && contentType.includes('text/html')) {
					return cheerio.load(data);
				}
				return data;
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
		});
	}

	// region Crawl teams
	async crawlFiFaTeam(leagueId): Promise<any> {
		console.info(`Fetching league id ${leagueId}`);
		const url = `/teams?league=${leagueId}&order=desc`;
		const result = await this.getParsedResponse(url);
		const teams = this.parseInfoFiFaTeam(result);
		await this.writeResult(`team.l${leagueId}.json`, teams);
		return teams;
	}

	private parseInfoFiFaTeam($: CheerioStatic): any {
		const result: any[] = [];
		const rows = $('table tbody tr');

		rows.each((i, row) => {
			const columns = $($(row).find('td'));

			const image = $($(columns.eq(0)).find('img')).attr();
			const bio = $($(columns.eq(1)).find('a')).attr();

			const league = $($(columns.eq(2)).find('a')).attr();

			const att = $($(columns.eq(3)));
			const mid = $($(columns.eq(4)));
			const def = $($(columns.eq(5)));
			const ovr = $($(columns.eq(6)));

			// Ratio - content as `{active} / {max}`
			const span = $(columns.eq(7)).find('span.star');
			const maxStars = $(span.find('i')).length;
			const activeStars = $(span.find('i.fas.fa-star')).length;
			const halfStars = $(span.find('i.fas.fa-star-half-alt')).length;
			const rating = `${activeStars + halfStars / 2}/${maxStars}`;

			result.push({
				fifaId: parseInt(bio['href'].split('/').filter(s => !!s)[1], 10),
				image: image['data-src'],
				title: bio['title'].replace(this._fifaRegex, '').trim(),
				name: bio['href'].split('/').filter(s => !!s)[2],
				league: {
					title: league['title'].replace(this._fifaRegex, '').trim(),
					fifaId: parseInt(league['href'].split('league=')[1], 10),
				},
				[att.attr()['data-title'].toLowerCase()]: parseInt(att.eq(0).text(), 10),
				[mid.attr()['data-title'].toLowerCase()]: parseInt(mid.eq(0).text(), 10),
				[def.attr()['data-title'].toLowerCase()]: parseInt(def.eq(0).text(), 10),
				[ovr.attr()['data-title'].toLowerCase()]: parseInt(ovr.eq(0).text(), 10),
				rating,
			});
		});

		return result;
	}
	// endregion Crawl teams

	// region Crawl from listing page
	async crawlFiFaPlayers(leagueId): Promise<any> {
		console.info(`Fetching players for league id ${leagueId}`);
		const result: any[] = [];
		let shouldContinue = true;
		let currentPage = 1;
		do {
			const responses = await this.crawlPlayersFiFaBatchPages(leagueId, currentPage, DEFAULT_PLAYER_PAGES);
			shouldContinue = responses.every(({ error, response }) => !error || response.status !== 404);
			result.push(...flattenDeep(responses.filter(({ error }) => !error).map(({ response }) => response)));
			currentPage += DEFAULT_PLAYER_PAGES;
			await sleep(1000);
		} while (shouldContinue);

		await this.writeResult(`player.l${leagueId}.json`, result);
		return result;
	}

	private async crawlPlayersFiFaBatchPages(leagueId, start, count): Promise<{ error: boolean; response: any }[]> {
		console.info(`Fetching ${count} players page for league ${leagueId} starting from ${start}`);
		return Promise.all(
			range(start, start + count).map(page =>
				this.crawlPlayerFiFaPage(leagueId, page)
					.then(playerData => {
						console.info(`Successfully fetched player page ${page} for league id ${leagueId}`);
						return { error: false, response: playerData };
					})
					.catch(error => {
						console.error(
							`Failed to fetch player page ${page} for league id ${leagueId}`,
							error.response.status
						);
						return { error: true, response: error.response };
					})
			)
		);
	}

	private async crawlPlayerFiFaPage(leagueId: string, page: number) {
		console.info(`Fetching player page ${page} for league id ${leagueId}`);
		const url = `/players/${page}/?league=${leagueId}&order=desc`;
		const result = await this.getParsedResponse(url);
		return this.parseInfoFiFaBulk(result);
	}

	private parseInfoFiFaBulk($: CheerioStatic): any {
		const result: any[] = [];
		const rows = $('table tbody tr');

		rows.each((i, row) => {
			const columns = $($(row).find('td'));

			const image = $($(columns.eq(0)).find('img')).attr();
			const nationality = $($(columns.eq(1)).find('a')).attr();
			const rating = $($(columns.eq(2)).find('span'))
				.eq(0)
				.text();

			const bio = $($(columns.eq(3)).find('a')).attr();

			const positions: string[] = [];
			const positionLinks = $($(columns.eq(4)).find('a'));
			positionLinks.each((pli, positionLink) => {
				positions.push($(positionLink).text());
			});

			const age = $($(columns.eq(5)))
				.eq(0)
				.text();

			const club = $($(columns.eq(7)).find('a')).attr();

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
					title: club['title'].replace(this._fifaRegex, '').trim(),
					fifaId: parseInt(club['href'].split('/').filter(s => !!s)[1], 10),
				},
			});
		});

		return result;
	}
	// endregion Crawl from listing page

	// region Crawl from detail page
	async crawlFiFaPlayerDetail(url): Promise<any> {
		const result = await this.getParsedResponse(url);
		return this.parseInfoFiFa(result);
	}

	private parseInfoFiFa($: CheerioStatic): any {
		let result = {};
		const cards = $('div.container div.card');
		let isInfoCard = true;

		cards.each((i, row) => {
			const header = this.resolveHeader($, row);
			if (!header) {
				return;
			}

			if (isInfoCard) {
				isInfoCard = false;
				result = {
					Info: {
						Name: header,
						Rating: $('span.rating')
							.eq(0)
							.text(),
						...this.resolveStats($, row),
					},
				};
			} else {
				result[header] = ['Traits', 'Specialities'].includes(header)
					? this.resolveSkills($, row)
					: this.resolveStats($, row);
			}
		});

		return result;
	}

	private resolveHeader($: CheerioStatic, row): string | null {
		const headerTag = $($(row).find('h5.card-header'));
		const node = this.resolveNode($, headerTag);
		if (!node) {
			return null;
		}

		return this.resolveKey($, node);
	}

	private resolveStats($: CheerioStatic, row): any {
		const dataRows = $($(row).find('p'));
		const content = {};
		dataRows.each((di, dataRow) => {
			const node = this.resolveNode($, dataRow);
			if (!node) {
				return;
			}

			const key = this.resolveKey($, node);
			if (!content.hasOwnProperty(key)) {
				content[key] = this.resolveValue($, node);
			}
		});
		return content;
	}

	private resolveSkills($: CheerioStatic, row): any {
		const dataRows = $($(row).find('p'));
		const content: string[] = [];
		dataRows.each((di, dataRow) => {
			content.push($(dataRow).text());
		});
		return content;
	}

	private resolveNode($: CheerioStatic, dataRow): any {
		return $(dataRow).eq(0)[0];
	}

	private resolveKey($: CheerioStatic, node): string {
		const children = $(node.children);
		return $(children)
			.eq(0)
			.text();
	}

	private resolveValue($: CheerioStatic, node): any {
		const span = $(node).find('span.float-right')[0];

		// Normal case - content as text
		if (span.children.length === 1 && span.children[0].type === 'text') {
			return $(span.children)
				.eq(0)
				.text();
		}

		// Link list - content as array of link label
		const links = $($(span).find('a'));
		if (links.length > 0) {
			const valueList: string[] = [];
			links.each((i, link) => {
				valueList.push($(link).text());
			});
			return valueList;
		}

		// Ratio - content as `{active} / {max}`
		const stars = $($(span).find('span.star'));
		if (stars.length > 0) {
			const maxStars = $(stars.find('i')).length;
			const activeStars = $(stars.find('i.fas')).length;
			return `${activeStars}/${maxStars}`;
		}

		// Fallback to raw text
		return $(span.children)
			.eq(0)
			.text();
	}
	// endregion Crawl from detail page

	private getParsedResponse(url) {
		return this.axios.get(url).then(({ data }) => data);
	}

	private async writeResult(relativePath, result) {
		await fsExtra.mkdirp(resourcesPath);
		await fsPromise.writeFile(path.resolve(resourcesPath, relativePath), JSON.stringify(result, null, 4), {
			encoding: 'utf-8',
		});
	}
}
