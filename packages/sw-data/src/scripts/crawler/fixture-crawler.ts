import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { FixtureCrawlerService } from '@data/crawler/fixture-crawler.service';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { leagues } from '@shared/lib/data/data.constants';
import { getSeason } from '@shared/lib/utils/season';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(FixtureCrawlerService);
	const season = getSeason(new Date());
	await Promise.all(
		leagues.map(async league => {
			try {
				const matches = await crawlerService.getMatchesForLeague(league, season);
				await crawlerService.writeResult(`fixtures/${league.id}.json`, {
					id: league.id,
					season: season,
					matches,
				});
			} catch (e) {}
		})
	);
	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished fixture crawler service');
});
