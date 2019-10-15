import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { TeamPlayerCrawlerService } from '@data/crawler/team-player-crawler.service';
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
	const crawlerService = context.get(TeamPlayerCrawlerService);
	// we are fine with fetching each league sequentially

	for (const { id: leagueId } of leagues) {
		await crawlerService.crawlTeam(leagueId);
		await crawlerService.crawlPlayers(leagueId);
	}
}

bootstrap().then(() => {
	console.info('Finished team-player crawler service');
});
