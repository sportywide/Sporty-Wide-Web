import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { FifaCrawlerService } from '@data/crawler/fifa-crawler.service';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { leagues } from '@shared/lib/data/data.constants';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(FifaCrawlerService);
	// we are fine with fetching each league sequentially

	for (const { id: leagueId } of leagues) {
		const teams = await crawlerService.crawlTeamsByLeague(leagueId);
		await crawlerService.writeResult(`teams/fifa-${leagueId}.json`, teams);

		const teamIds = teams.map(team => team.fifaId);
		const players = await crawlerService.crawlPlayersByTeams(teamIds);
		await crawlerService.writeResult(`players/fifa-${leagueId}.json`, players);
	}

	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished team-player crawler service');
});
