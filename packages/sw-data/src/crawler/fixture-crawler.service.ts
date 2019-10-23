import https from 'https';
import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import cheerio from 'cheerio';
import { parse } from 'date-fns';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { ResultsService } from '@data/crawler/results.service';
import { League } from '@data/crawler/crawler.constants';
import { getSeasonYears, isInSeason } from '@shared/lib/utils/season';

@Injectable()
export class FixtureCrawlerService extends ResultsService {
	private axios: AxiosInstance;

	constructor(@Inject(DATA_LOGGER) private readonly logger: Logger) {
		super();
		this.axios = axios.create({
			baseURL: 'https://www.skysports.com',
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			transformResponse: (data, headers) => {
				const contentType = headers['content-type'];
				if (contentType && contentType.includes('text/html')) {
					return cheerio.load(data);
				}
				return data;
			},
		});
	}

	async getMatchesForLeague(league: League, season: string | null) {
		if (!season) {
			return;
		}
		const name = league.name;
		try {
			const [results, fixtures] = await Promise.all([
				this.getResultsForLeague(name, season),
				this.getFixturesForLeague(name, season),
			]);
			const matches = [...results, ...fixtures].sort((a, b) => a.time.getTime() - b.time.getTime());
			this.writeResult(`fixtures/${name}.json`, {
				id: league.id,
				season: season,
				matches,
			});
		} catch (e) {
			this.logger.error(`Failed to get matches for league ${name}`, e);
		}
	}

	async getFixturesForLeague(league: string, season: string) {
		this.logger.info('Getting fixture for league', league);
		const [start, end] = getSeasonYears(season);
		const seasonString = [start, end.toString().replace(/\d{2}(\d{2})/, '$1')].join('-');
		const { data: content } = await this.axios.get(`https://www.skysports.com/${league}-fixtures/${seasonString}`);
		return this.parseFixture(content, season);
	}

	async getResultsForLeague(league: string, season: string) {
		this.logger.info('Getting results for league', league);
		const [start, end] = getSeasonYears(season);
		const seasonString = [start, end.toString().replace(/\d{2}(\d{2})/, '$1')].join('-');
		const { data: content } = await this.axios.get(`https://www.skysports.com/${league}-results/${seasonString}`);
		return this.parseFixture(content, season);
	}

	private parseFixture($: CheerioStatic, season) {
		const allResults: any[] = [];
		const showMoreScript = $('script[type="text/show-more"]');
		showMoreScript.replaceWith($(showMoreScript.html()));
		let currentMonth: Date;
		$('.fixres__header2').each((index, headerNode) => {
			const headerElement = $(headerNode);
			const monthHeader = headerElement.prev('.fixres__header1');
			if (monthHeader.length) {
				// if month header exists
				const currentMonthStr = monthHeader.text();
				currentMonth = parse(currentMonthStr, 'MMMM yyyy', new Date());
			}
			if (!isInSeason(currentMonth, season)) {
				return;
			}
			const fixtureDateStr = headerElement.text();
			const fixtureDate = parse(fixtureDateStr, 'EEEE do MMMM', new Date());
			const fixtureElements = $(headerElement).nextUntil('fixres__header2', '.fixres__item');
			const fixtureDetails = fixtureElements.map((index, fixtureNode) => {
				const fixtureElement = $(fixtureNode);
				const fixtureLinkElement = fixtureElement.find('.matches__link');
				const fixtureLink = fixtureLinkElement.attr('href');
				const homeTeam = fixtureElement.find('.matches__participant--side1 .swap-text__target').text();
				const awayTeam = fixtureElement.find('.matches__participant--side2 .swap-text__target').text();
				const hourStr = fixtureElement.find('.matches__date').text();
				const [hour, minute] = hourStr.split(':').map(number => parseInt(number, 10));
				const matchResults = fixtureElement.find('.matches__status');
				const hasHappened = fixtureLinkElement.data('status') !== 'KO';
				let status;
				let current;
				let homeScore, awayScore;
				if (hasHappened) {
					[homeScore, awayScore] = Array.from(matchResults.find('.matches__teamscores-side')).map(node =>
						parseInt($(node).text())
					);
					status = 'FT';
					current = 90;
				} else {
					status = 'PENDING';
					current = 0;
				}
				return {
					link: fixtureLink,
					home: homeTeam,
					away: awayTeam,
					status,
					homeScore,
					awayScore,
					current,
					time: new Date(
						Date.UTC(
							currentMonth.getFullYear(),
							currentMonth.getMonth(),
							fixtureDate.getDate(),
							hour,
							minute,
							0
						)
					),
				};
			});
			allResults.push(...Array.from(fixtureDetails));
		});
		return allResults;
	}
}
