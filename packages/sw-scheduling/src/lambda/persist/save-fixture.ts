import { error, ok } from '@scheduling/lib/http';
import { INestApplicationContext } from '@nestjs/common';
import { cleanup, getLogger, initModule, SchedulingPersisterModule } from '@scheduling/lib/scheduling.module';
import { FixturePersisterService } from '@data/persister/fixture/fixture-persister.service';
import { S3Event } from 'aws-lambda';
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
		const fixtures = JSON.parse(objectDetails.Body!.toString('utf8'));
		const fixturePersister = module.get(FixturePersisterService);
		await fixturePersister.saveFixtures(fixtures);

		return ok('SUCCESS');
	} catch (e) {
		const logger = getLogger(module);
		logger.error(__filename, e);
		return error(e);
	} finally {
		await cleanup();
	}
}
