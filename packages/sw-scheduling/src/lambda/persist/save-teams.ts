import { error, ok } from '@scheduling/lib/http';
import { INestApplicationContext } from '@nestjs/common';
import { cleanup, getLogger, initModule, SchedulingPersisterModule } from '@scheduling/lib/scheduling.module';
import { TeamPersisterService } from '@data/persister/team/team-persister.service';
import { S3Event } from 'aws-lambda';
import { parseBody } from '@core/aws/lambda/body-parser';
import { S3Service } from '@core/aws/s3/s3.service';
import { SnsService } from '@core/aws/sns/sns.service';

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
		const teams = JSON.parse(objectDetails.Body!.toString('utf8'));
		const teamPersister = module.get(TeamPersisterService);
		await teamPersister.saveFifaTeams(teams);
		const leagueId = (objectDetails.Metadata || {}).league;
		const snsService = module.get(SnsService);
		await snsService.publish({
			Topic: 'fifa-team-topic',
			Message: leagueId,
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
