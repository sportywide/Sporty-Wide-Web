import { DATA_LOGGER } from '@core/logging/logging.constant';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { leagues } from '@data/data.constants';
import { TeamPlayerScoreboardCrawlerService } from '@data/crawler/team-player-scoreboard-crawler.service';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(TeamPlayerScoreboardCrawlerService);

	try {
		await crawlerService.init();
		const leagueTeams = (await Promise.all(
			leagues.map(league => crawlerService.crawlTeams(league.scoreboardUrl).then(teams => ({ teams, league })))
		)).filter(teamResult => !!teamResult);
		await crawlerService.close();
		for (const leagueTeam of leagueTeams) {
			await crawlerService.writeResult(`teams/scoreboard-${leagueTeam.league.id}.json`, leagueTeam);
		}

		const allTeams: any[] = [];
		for (const leagueTeam of leagueTeams) {
			for (const team of leagueTeam.teams!) {
				allTeams.push({
					league: leagueTeam.league,
					...team,
				});
			}
		}
		const playersMap = await crawlerService.crawlPlayers(
			allTeams.map(team => ({ url: team.teamUrl, id: team.teamUrl }))
		);
		for (const leagueTeam of leagueTeams) {
			const result = {};
			for (const team of leagueTeam.teams!) {
				result[team.teamName] = playersMap[team.teamUrl];
			}
			await crawlerService.writeResult(`players/scoreboard-${leagueTeam.league.name}.json`, {
				players: result,
				leagueId: leagueTeam.league.id,
			});
		}
	} finally {
		await crawlerService.close();
	}

	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished team-player crawler service');
});
