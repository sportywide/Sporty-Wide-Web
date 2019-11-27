import { error, ok } from '@scheduling/lib/http';
import { cleanup, initModule, SchedulingPersisterModule } from '@scheduling/lib/scheduling.module';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { PlayerPersisterService } from '@data/persister/player/player-persister.service';
import { parseBody } from '@scheduling/lib/aws/lambda/body-parser';

export async function handler(event, context) {
	try {
		context.callbackWaitsForEmptyEventLoop = false;
		const { key, bucketName } = parseBody(event);
		const module = await initModule(SchedulingPersisterModule);
		const s3Service = module.get(S3Service);
		const objectDetails = await s3Service.getObject({
			Key: key,
			Bucket: bucketName,
		});
		const players = JSON.parse(objectDetails.Body!.toString('utf8'));
		const playerPersister = module.get(PlayerPersisterService);
		await playerPersister.saveFifaPlayers(players);

		return ok('SUCCESS');
	} catch (e) {
		console.error(e);
		return error(e);
	} finally {
		await cleanup();
	}
}
