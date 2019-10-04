import path from 'path';
import { fsPromise } from '@shared/lib/utils/promisify/fs';
import fsExtra from 'fs-extra';
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import cheerio from 'cheerio';
const resourcesPath = path.resolve(process.cwd(), 'resources');

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
		});
	}

	// region Crawl teams
	async crawlTeamFiFa(leagueId): Promise<any> {
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
	async crawlPlayerFiFaBatch(leagueId, first, last): Promise<any> {
		let index = first;
		const result: any[] = [];
		const promises: Promise<any>[] = [];
		while (index <= last) {
			promises.push(
				this.delayBatchPlayer(leagueId, index, first)
					.then(() => {
						console.info(`Finished page ${index}`);
					})
					.catch(e => console.error(`Failed to fetch player page ${index}`, e))
			);
			index++;
		}

		const batches = (await Promise.all(promises)).filter(result => !(result instanceof Error));
		batches.forEach(batch => {
			result.push(...batch);
		});

		await this.writeResult(`player.l${leagueId}.p${first}-${last}.json`, result);
		return result;
	}

	private delayBatchPlayer(leagueId: string, i: number, first: number) {
		console.info(`Fetching player page ${i} for league id ${leagueId}`);
		return new Promise((resolve, reject) =>
			setTimeout(async () => {
				try {
					const url = `/players/${i}/?league=${leagueId}&order=desc`;
					const result = await this.getParsedResponse(url);
					const batchPlayers = this.parseInfoFiFaBulk(result);
					resolve(batchPlayers);
				} catch (e) {
					reject(e);
				}
			}, (i - first + 1) * 1000)
		);
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
	async crawlPlayerPageFiFa(url): Promise<any> {
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
