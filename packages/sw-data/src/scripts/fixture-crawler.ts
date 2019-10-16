import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { FixtureCrawlerService } from '@data/crawler/fixture-crawler.service';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { leagues } from '@data/crawler/crawler.constants';
import { noop } from '@shared/lib/utils/functions';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(FixtureCrawlerService);
	await Promise.all(leagues.map(league => crawlerService.getMatchesForLeague(league.name).catch(noop)));
	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished fixture crawler service');
});
