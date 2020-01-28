import { error, ok } from '@scheduling/lib/http';
import { cleanup, getLogger, initModule, SchedulingPersisterModule } from '@scheduling/lib/scheduling.module';
import { S3Event } from 'aws-lambda';
import { INestApplicationContext } from '@nestjs/common';
import { PlayerPersisterService } from '@data/persister/player/player-persister.service';
import { parseBody } from '@core/aws/lambda/body-parser';
import { S3Service } from '@core/aws/s3/s3.service';

export async function handler(event: S3Event, context) {
	let module: INestApplicationContext;
	try {
		context.callbackWaitsForEmptyEventLoop = false;
		const { key, bucketName } = parseBody(event);
		module = await initModule(SchedulingPersisterModule);
		const s3Service = module.get(S3Service);
		const objectDetails = await s3Service.getObject({
			Key: key,
			Bucket: bucketName,
		});
		const playerMap = JSON.parse(objectDetails.Body!.toString('utf8'));
		const leagueId = parseInt((objectDetails.Metadata || {}).league, 10);
		const season = (objectDetails.Metadata || {}).season;
		const playerPersister = module.get(PlayerPersisterService);
		await playerPersister.savePlayerStat({
			players: playerMap,
			leagueId,
			season,
		});
		return ok('SUCCESS');
	} catch (e) {
		const logger = getLogger(module);
		logger.error(__filename, e);
		return error(e);
	} finally {
		await cleanup();
	}
}
