import https from 'https';
import { DATA_CONFIG } from '@core/config/config.constants';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import Cheerio from 'cheerio';
import { Logger } from 'log4js';
import { Provider } from 'nconf';
import { EspnTeam } from '@shared/lib/dtos/leagues/league-standings.dto';
import { ResultsService } from '@data/crawler/results.service';
import { EspnPlayer } from '@shared/lib/dtos/player/player.dto';
import { sleep } from '@shared/lib/utils/sleep';

const MAX_ATTEMPTS = 4;

@Injectable()
export class EspnCrawlerService extends ResultsService {
	private axios: AxiosInstance;

	constructor(@Inject(DATA_CONFIG) config: Provider, @Inject(DATA_LOGGER) private readonly logger: Logger) {
		super();
		this.axios = axios.create({
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
		this.logger.info(`Getting teams for league ${leagueUrl}`);
		const { data } = await this.axios.get(leagueUrl);
		return this.parseTeams(data);
	}

	async crawlPlayers(teamUrl, season) {
		for (let i = 0; i < MAX_ATTEMPTS; i++) {
			try {
				this.logger.info(`Attempt ${i + 1}: Getting players for team ${teamUrl} in season ${season}`);
				const { data } = await this.axios.get(teamUrl);
				return this.parsePlayers(data, season);
			} catch (e) {
				this.logger.error('Failed to get players', e);
				await sleep(1000 * (i + 1));
			}
		}
	}

	private parsePlayers($: CheerioStatic, season: string): EspnPlayer[] {
		return [...this.parseGoalKeepers($, season), ...this.parseOutfieldPlayers($, season)];
	}

	private parseOutfieldPlayers($, season): EspnPlayer[] {
		return Array.from($('.outfield .Table__Scroller .Table__TBODY .Table__TR')).map(node => {
			const element = $(node);
			const name = element
				.find('.Table__TD')
				.eq(0)
				.find('span > a')
				.text();
			const jersey = element
				.find('.Table__TD')
				.eq(0)
				.find('span > span')
				.text();
			const played = element
				.find('.Table__TD')
				.eq(6)
				.text();
			const subbed = element
				.find('.Table__TD')
				.eq(7)
				.text();
			const goals = element
				.find('.Table__TD')
				.eq(8)
				.text();
			const assist = element
				.find('.Table__TD')
				.eq(9)
				.text();
			const shots = element
				.find('.Table__TD')
				.eq(10)
				.text();
			const shotsOnTarget = element
				.find('.Table__TD')
				.eq(11)
				.text();
			const foulsCommitted = element
				.find('.Table__TD')
				.eq(12)
				.text();
			const foulsSuffered = element
				.find('.Table__TD')
				.eq(13)
				.text();
			const yellowCard = element
				.find('.Table__TD')
				.eq(14)
				.text();
			const redCard = element
				.find('.Table__TD')
				.eq(15)
				.text();
			return {
				name,
				jersey: parseInt(jersey, 10),
				yellow: parseInt(yellowCard, 10),
				red: parseInt(redCard, 10),
				played: parseInt(played, 10),
				subbed: parseInt(subbed, 10),
				scored: parseInt(goals, 10),
				shotsOnTarget: parseInt(shotsOnTarget, 10),
				shots: parseInt(shots, 10),
				saves: 0,
				assist: parseInt(assist, 10),
				foulsCommitted: parseInt(foulsCommitted, 10),
				foulsSuffered: parseInt(foulsSuffered, 10),
				season,
			};
		});
	}

	private parseGoalKeepers($, season): EspnPlayer[] {
		return Array.from($('.goalkeepers .Table__Scroller .Table__TBODY .Table__TR')).map(node => {
			const element = $(node);
			const name = element
				.find('.Table__TD')
				.eq(0)
				.find('span > a')
				.text();
			const jersey = element
				.find('.Table__TD')
				.eq(0)
				.find('span > span')
				.text();
			const played = element
				.find('.Table__TD')
				.eq(6)
				.text();
			const subbed = element
				.find('.Table__TD')
				.eq(7)
				.text();
			const saves = element
				.find('.Table__TD')
				.eq(8)
				.text();
			const assist = element
				.find('.Table__TD')
				.eq(10)
				.text();
			const foulsCommitted = element
				.find('.Table__TD')
				.eq(11)
				.text();
			const foulsSuffered = element
				.find('.Table__TD')
				.eq(12)
				.text();
			const yellowCard = element
				.find('.Table__TD')
				.eq(13)
				.text();
			const redCard = element
				.find('.Table__TD')
				.eq(14)
				.text();
			return {
				name,
				jersey: parseInt(jersey, 10),
				yellow: parseInt(yellowCard, 10),
				red: parseInt(redCard, 10),
				played: parseInt(played, 10),
				shots: 0,
				shotsOnTarget: 0,
				subbed: parseInt(subbed, 10),
				scored: 0,
				saves: parseInt(saves, 10),
				assist: parseInt(assist, 10),
				foulsCommitted: parseInt(foulsCommitted, 10),
				foulsSuffered: parseInt(foulsSuffered, 10),
				season,
			};
		});
	}

	private parseTeams($: CheerioStatic): { teams: EspnTeam[]; season: string } {
		const teamUrls = Array.from($('div.standings__table > section > div.flex > table > tbody > tr')).map(node => {
			const element = $(node);
			const url = element
				.find('.hide-mobile .AnchorLink')
				.attr('href')
				.replace('/football/club', '/football/team/squad');
			const name = element.find('.hide-mobile a').text();
			return { url, name };
		});

		const teams = Array.from(
			$('div.standings__table > section > div.flex > div > div.Table__Scroller > table > tbody > tr')
		).map((node, index) => {
			const element = $(node);
			const { url, name } = teamUrls[index];

			const played = parseInt(
				element
					.find('td')
					.eq(0)
					.text(),
				10
			);
			const wins = parseInt(
				element
					.find('td')
					.eq(1)
					.text(),
				10
			);
			const draws = parseInt(
				element
					.find('td')
					.eq(2)
					.text(),
				10
			);
			const losses = parseInt(
				element
					.find('td')
					.eq(3)
					.text(),
				10
			);
			const scored = parseInt(
				element
					.find('td')
					.eq(4)
					.text(),
				10
			);
			const conceded = parseInt(
				element
					.find('td')
					.eq(5)
					.text(),
				10
			);
			const points = parseInt(
				element
					.find('td')
					.eq(7)
					.text(),
				10
			);

			return {
				url: `https://www.espn.com.au${url}`,
				name,
				played,
				wins,
				draws,
				losses,
				scored,
				conceded,
				points,
			};
		});
		const heading = $('.headline.headline__h1.dib').text();
		let [, season] = heading.match(/.* Table (\d{4}-\d{2})/);
		const seasonParts = season.split('-');
		season = [seasonParts[0], `${seasonParts[0].substr(0, 2)}${seasonParts[1]}`].join('-');
		return {
			teams,
			season,
		};
	}
}
