import { error, ok } from '@scheduling/lib/http';
import { cleanup, initModule, SchedulingPersisterModule } from '@scheduling/lib/scheduling.module';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { FixturePersisterService } from '@data/persister/fixture/fixture-persister.service';
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
		const fixtures = JSON.parse(objectDetails.Body!.toString('utf8'));
		const fixturePersister = module.get(FixturePersisterService);
		await fixturePersister.saveFixtures(fixtures);

		return ok('SUCCESS');
	} catch (e) {
		console.error(e);
		return error(e);
	} finally {
		await cleanup();
	}
}
