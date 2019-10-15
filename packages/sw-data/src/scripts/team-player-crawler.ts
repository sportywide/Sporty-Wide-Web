import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { TeamPlayerCrawlerService } from '@data/crawler/team-player-crawler.service';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { leagues } from '@data/crawler/crawler.constants';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(TeamPlayerCrawlerService);
	// we are fine with fetching each league sequentially

	for (const { id: leagueId } of leagues) {
		await crawlerService.crawlTeam(leagueId);
		await crawlerService.crawlPlayers(leagueId);
	}

	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished team-player crawler service');
});
