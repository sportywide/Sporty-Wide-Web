import { DATA_LOGGER } from '@core/logging/logging.constant';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { BrowserService } from '@data/crawler/browser.service';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(WhoScoreCrawlerService);
	const logger = context.get(DATA_LOGGER);
	try {
		const leagues = await crawlerService.getLeagues();
		logger.info(leagues);
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
