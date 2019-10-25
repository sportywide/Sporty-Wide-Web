import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { TeamPlayerFifaCrawlerService } from '@root/packages/sw-data/src/crawler/team-player-fifa-crawler.service';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { leagues } from '@root/packages/sw-data/src/data.constants';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(TeamPlayerFifaCrawlerService);
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
