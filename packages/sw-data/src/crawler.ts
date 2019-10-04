import { NestFactory } from '@nestjs/core';
import { DataModule } from '@data/data.module';
import { INestApplicationContext } from '@nestjs/common';
import { CrawlerService } from '@data/crawler/crawler.service';

const PREMIER_LEAGUE_ID = 13;

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(DataModule);
	const crawlerService = context.get(CrawlerService);
	await crawlerService.crawlTeamFiFa(PREMIER_LEAGUE_ID);
	await crawlerService.crawlPlayerFiFaBatch(PREMIER_LEAGUE_ID, 1, 22);
}

bootstrap().then(() => {
	console.info('Finished crawler service');
});
