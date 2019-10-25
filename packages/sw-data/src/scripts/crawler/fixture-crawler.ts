import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { FixtureCrawlerService } from '@data/crawler/fixture-crawler.service';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { leagues } from '@root/packages/sw-data/src/data.constants';
import { noop } from '@shared/lib/utils/functions';
import { getSeason } from '@shared/lib/utils/season';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(FixtureCrawlerService);
	const season = getSeason(new Date());
	await Promise.all(leagues.map(league => crawlerService.getMatchesForLeague(league, season).catch(noop)));
	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished fixture crawler service');
});