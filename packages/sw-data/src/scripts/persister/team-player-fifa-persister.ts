import { NestFactory } from '@nestjs/core';
import { DataModule } from '@data/data.module';
import { INestApplicationContext } from '@nestjs/common';
import { PlayerPersisterService } from '@data/persister/player/player-persister.service';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { TeamPersisterService } from '@data/persister/team/team-persister.service';
import mongoose from 'mongoose';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(DataModule);
	const playerPersisterService = context.get(PlayerPersisterService);
	const teamPersisterService = context.get(TeamPersisterService);
	await teamPersisterService.saveTeamsFromFifaInfoFiles();
	await playerPersisterService.saveFifaPlayersFromPlayerInfoFiles();

	return context;
}

bootstrap().then(async context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished persister service');
	await mongoose.disconnect();
});
