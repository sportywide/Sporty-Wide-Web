import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { keyBy } from 'lodash';
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
		const matches = [
			{
				fixtureId: 408206,
				url: '/Matches/1376144/Live/England-Premier-League-2019-2020-Newcastle-United-Chelsea',
			},
		];
		const matchGroup = keyBy(matches, 'url');
		const matchRatings = await crawlerService.getRatings(matches.map(match => match.url));
		const logger = context.get(DATA_LOGGER);
		await Promise.all(
			Object.entries(matchRatings).map(async ([ratingUrl, ratingData]) => {
				const { fixtureId } = matchGroup[ratingUrl];
				const fixture = await fixtureService.findById({ id: fixtureId });
				if (!fixture) {
					logger.error(`Cannot find match ${ratingUrl}`);
					return;
				}
				const { away, home } = ratingData;
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
	logger.info('Finished single score crawler service');
});
