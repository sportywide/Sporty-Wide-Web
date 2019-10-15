import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { FixtureCrawlerService } from '@data/crawler/fixture-crawler.service';
import { CrawlerModule } from '@data/crawler/crawler.module';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(FixtureCrawlerService);
	await crawlerService.getResultsForLeague('premier-league');
	await crawlerService.getFixturesForLeague('premier-league');
}

bootstrap().then(() => {
	console.info('Finished fixture crawler service');
});
