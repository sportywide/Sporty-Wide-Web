import https from 'https';
import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import cheerio from 'cheerio';
import { parse } from 'date-fns';

@Injectable()
export class FixtureCrawlerService {
	private axios: AxiosInstance;
	private initiated: boolean;
	private cookies: string;

	constructor() {
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

	async getFixturesForLeague(league: string) {
		console.info('Getting fixture for league', league);
		const { data: content } = await this.axios.get(`https://www.skysports.com/${league}-fixtures`);
		const fixtures = this.parseFixture(content);
		console.info(fixtures);
	}

	async getResultsForLeague(league: string) {
		console.info('Getting fixture for league', league);
		const { data: content } = await this.axios.get(`https://www.skysports.com/${league}-results`);
		const fixtures = this.parseFixture(content);
		console.info(fixtures);
	}

	private parseFixture($: CheerioStatic) {
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
				let homeScore, awayScore;
				if (hasHappened) {
					[homeScore, awayScore] = Array.from(matchResults.find('.matches__teamscores-side')).map(node =>
						parseInt($(node).text())
					);
					const matchesInfo = fixtureElement.find('.matches__info');
					status = matchesInfo.text().trim() === 'FT' ? 'PAST' : 'ACTIVE';
				} else {
					status = 'PENDING';
				}
				return {
					link: fixtureLink,
					home: homeTeam,
					away: awayTeam,
					status,
					homeScore,
					awayScore,
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
