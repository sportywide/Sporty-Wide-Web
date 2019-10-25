import { NestFactory } from '@nestjs/core';
import { DataModule } from '@data/data.module';
import { INestApplicationContext } from '@nestjs/common';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { TeamPersisterService } from '@data/persister/team/team-persister.service';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(DataModule);
	const teamPersisterService = context.get(TeamPersisterService);
	await teamPersisterService.saveTeamsFromScoreBoardInfoFiles();

	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished persister service');
});
