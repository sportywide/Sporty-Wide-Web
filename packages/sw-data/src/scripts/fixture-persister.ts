import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { DATA_LOGGER } from '@core/logging/logging.constant';
import { FixturePersisterService } from '@data/persister/fixture/fixture-persister.service';
import { PersisterModule } from '@data/persister/persister.module';

async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(PersisterModule);
	const fixturePersiterService = context.get(FixturePersisterService);
	await fixturePersiterService.saveFixtures();

	return context;
}

bootstrap().then(context => {
	const logger = context.get(DATA_LOGGER);
	logger.info('Finished persister service');
});
