import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { format } from 'date-fns';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(WhoScoreCrawlerService);
	const logger = context.get(DATA_LOGGER);
	try {
		const leagues = await crawlerService.getLeagues();
		logger.info(leagues);
		const teams = await crawlerService.getTeams('/Regions/252/Tournaments/2/England-Premier-League');
	} finally {
		await crawlerService.close();
	}
	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished score crawler service');
});
