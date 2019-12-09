import { error, ok } from '@scheduling/lib/http';
import { cleanup, initModule, SchedulingPersisterModule } from '@scheduling/lib/scheduling.module';
import { TeamPersisterService } from '@data/persister/team/team-persister.service';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { parseBody } from '@scheduling/lib/aws/lambda/body-parser';
import { S3Event } from 'aws-lambda';

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
		const content = JSON.parse(objectDetails.Body!.toString('utf8'));
		const teamPersister = module.get(TeamPersisterService);
		await teamPersister.saveScoreboardTeamResult(content);
		return ok('SUCCESS');
	} catch (e) {
		console.error(__filename, e);
		return error(e);
	} finally {
		await cleanup();
	}
}
