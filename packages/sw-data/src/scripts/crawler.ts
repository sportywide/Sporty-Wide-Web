import { NestFactory } from '@nestjs/core';
import { DataModule } from '@data/data.module';
import { INestApplicationContext } from '@nestjs/common';
import { CrawlerService } from '@data/crawler/crawler.service';
import { CrawlerModule } from '@data/crawler/crawler.module';

const leagues = [
	{
		name: 'premier-league',
		id: 13,
	},
	{
		name: 'la-liga',
		id: 53,
	},
	{
		name: 'bundesliga',
		id: 19,
	},
	{
		name: 'seria-a',
		id: 31,
	},
	{
		name: 'ligue-one',
		id: 16,
	},
];

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(CrawlerService);
	// we are fine with fetching each league sequentially

	for (const { id: leagueId } of leagues) {
		await crawlerService.crawlFiFaTeam(leagueId);
		await crawlerService.crawlFiFaPlayers(leagueId);
	}
}

bootstrap().then(() => {
	console.info('Finished crawler service');
});
