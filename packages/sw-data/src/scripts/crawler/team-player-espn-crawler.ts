import { DATA_LOGGER } from '@core/logging/logging.constant';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { leagues } from '@shared/lib/data/data.constants';
import { BrowserService } from '@data/crawler/browser.service';
import { EspnCrawlerService } from '@data/crawler/espn-crawler.service';
import { EspnPlayer } from '@shared/lib/dtos/player/player.dto';
import { chunk as lodashChunk } from 'lodash';
import { sleep } from '@shared/lib/utils/sleep';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(CrawlerModule);
	const crawlerService = context.get(EspnCrawlerService);

	try {
		const leagueTeams = (
			await Promise.all(
				leagues.map(league =>
					crawlerService.crawlTeams(league.espnUrl).then(({ teams, season }) => ({ teams, season, league }))
				)
			)
		).filter(teamResult => !!teamResult);
		for (const leagueTeam of leagueTeams) {
			await crawlerService.writeResult(`teams/espn-${leagueTeam.league.id}.json`, leagueTeam);
			const result: Record<string, EspnPlayer[]> = {};
			for (const chunk of lodashChunk(leagueTeam.teams, 5)) {
				await Promise.all(
					chunk.map(async team => {
						result[team.name] = await crawlerService.crawlPlayers(team.url, leagueTeam.season);
					})
				);
				await sleep(2000);
			}
			await crawlerService.writeResult(`players/espn-${leagueTeam.league.id}.json`, {
				players: result,
				leagueId: leagueTeam.league.id,
				season: leagueTeam.season,
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
