import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { groupBy } from 'lodash';
import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { BrowserService } from '@data/crawler/browser.service';
import { PlayerPersisterService } from '@data/persister/player/player-persister.service';
import { DataModule } from '@data/data.module';
import { FixtureService } from '@schema/fixture/services/fixture.service';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(DataModule);
	const crawlerService = context.get(WhoScoreCrawlerService);
	const playerPersisterService = context.get(PlayerPersisterService);
	const fixtureService = context.get(FixtureService);

	try {
		const date = new Date(2020, 0, 18);
		const matches = await crawlerService.getLiveMatches(date);
		const logger = context.get(DATA_LOGGER);

		const finishedMatches = matches.filter(match => match.status === 'FT');
		const finishedMatchLinks = finishedMatches.map(match => match.link).filter(link => link);
		const matchGroup = groupBy(matches, 'whoscoreLeagueId');
		const mappedMatches = await fixtureService.matchDbFixtures(context, matchGroup, date);
		const dbFixtureMatchedByLink = {};

		logger.info(`Getting ratings for ${finishedMatches.length} matches`);
		const ratingMap = await crawlerService.getRatings(finishedMatchLinks);

		for (const [fixture, dbFixture] of mappedMatches.entries()) {
			dbFixtureMatchedByLink[fixture.link] = dbFixture;
		}
		await Promise.all(
			Object.entries(ratingMap).map(async ([ratingUrl, ratingData]) => {
				const { away, home } = ratingData;
				const fixture = dbFixtureMatchedByLink[ratingUrl];
				if (!fixture) {
					logger.error(`Cannot find match ${ratingUrl}`);
					return;
				}
				try {
					await Promise.all([
						playerPersisterService.savePlayerRatings(
							fixture.id,
							{
								id: fixture.homeId,
								name: fixture.home,
							},
							home
						),
						playerPersisterService.savePlayerRatings(
							fixture.id,
							{
								id: fixture.awayId,
								name: fixture.away,
							},
							away
						),
					]);
				} catch (e) {
					console.error(`Failed to process ${ratingUrl}`, e);
				}
			})
		);
	} finally {
		const browserService = context.get(BrowserService);
		await browserService.close();
	}
	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished score crawler service');
});
