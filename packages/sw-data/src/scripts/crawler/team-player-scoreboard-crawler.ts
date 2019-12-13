import { DATA_LOGGER } from '@core/logging/logging.constant';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { leagues } from '@shared/lib/data/data.constants';
import { ScoreboardCrawlerService } from '@data/crawler/scoreboard-crawler.service';
import { BrowserService } from '@data/crawler/browser.service';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(ScoreboardCrawlerService);

	try {
		const leagueTeams = (await Promise.all(
			leagues.map(league =>
				crawlerService.crawlTeams(league.scoreboardUrl).then(({ teams, season }) => ({ teams, season, league }))
			)
		)).filter(teamResult => !!teamResult);
		for (const leagueTeam of leagueTeams) {
			await crawlerService.writeResult(`teams/scoreboard-${leagueTeam.league.id}.json`, leagueTeam);
			const playersMap = await crawlerService.crawlPlayers(
				leagueTeam.teams.map(team => team.url),
				leagueTeam.season
			);
			const result = {};
			for (const team of leagueTeam.teams!) {
				result[team.name] = playersMap[team.url];
			}
			await crawlerService.writeResult(`players/scoreboard-${leagueTeam.league.id}.json`, {
				players: result,
				leagueId: leagueTeam.league.id,
			});
		}
	} finally {
		const browserService = context.get(BrowserService);
		await browserService.close();
	}

	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished team-player crawler service');
});
