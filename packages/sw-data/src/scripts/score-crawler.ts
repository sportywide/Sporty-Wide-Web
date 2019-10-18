import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { ScoreCrawlerService } from '@data/crawler/score-crawler.service';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(ScoreCrawlerService);

	try {
		await crawlerService.getLiveMatches(new Date(2019, 9, 6));
		//await crawlerService.getLiveMatches(new Date());
	} finally {
		await crawlerService.close();
	}
	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished score crawler service');
});
