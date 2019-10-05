import { NestFactory } from '@nestjs/core';
import { DataModule } from '@data/data.module';
import { INestApplicationContext } from '@nestjs/common';
import { PlayerPersisterService } from '@data/persister/player/player-persister.service';
async function bootstrap() {
	const context: INestApplicationContext = await NestFactory.createApplicationContext(DataModule);
	const playerPersisterService = context.get(PlayerPersisterService);
	console.info(await playerPersisterService.findUsers());
}

bootstrap().then(() => {
	console.info('Finished persister service');
});
