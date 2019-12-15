import { error, ok } from '@scheduling/lib/http';
import { cleanup, initModule, SchedulingPersisterModule } from '@scheduling/lib/scheduling.module';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { parseBody } from '@scheduling/lib/aws/lambda/body-parser';
import { S3Event } from 'aws-lambda';
import { PlayerPersisterService } from '@data/persister/player/player-persister.service';

export async function handler(event: S3Event, context) {
	try {
		context.callbackWaitsForEmptyEventLoop = false;
		const { key, bucketName } = parseBody(event);
		const module = await initModule(SchedulingPersisterModule);
		const s3Service = module.get(S3Service);
		const objectDetails = await s3Service.getObject({
			Key: key,
			Bucket: bucketName,
		});
		const playerMap = JSON.parse(objectDetails.Body!.toString('utf8'));
		const leagueId = parseInt((objectDetails.Metadata || {}).league, 10);
		const season = (objectDetails.Metadata || {}).season;
		const playerPersister = module.get(PlayerPersisterService);
		await playerPersister.saveScoreboardPlayer({
			players: playerMap,
			leagueId,
			season,
		});
		return ok('SUCCESS');
	} catch (e) {
		console.error(__filename, e);
		return error(e);
	} finally {
		await cleanup();
	}
}
