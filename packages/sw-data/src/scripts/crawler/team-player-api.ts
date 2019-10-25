import { DATA_LOGGER } from '@core/logging/logging.constant';
import { TeamApiService } from '@data/api/api-football/api-team.service';
import { DataModule } from '@data/data.module';
import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { leagues } from '@data/data.constants';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(DataModule);
	const teamApiService = context.get(TeamApiService);
	const logger = context.get(DATA_LOGGER);
	const teams = (await Promise.all(
		leagues.map(league =>
			teamApiService
				.getTeams(league.apiFootballId)
				.then(teams => ({ teams, league: league.id }))
				.catch(e => {
					logger.error(`Failed to get data for league ${league.name}`, e);
				})
		)
	)).filter(teamResult => teamResult);
	teamApiService.writeResult('teams/api-teams.json', teams);
	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished score crawler service');
});
