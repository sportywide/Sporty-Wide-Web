import { error, ok } from '@scheduling/lib/http';
import { cleanup, getLogger, initModule, SchedulingPersisterModule } from '@scheduling/lib/scheduling.module';
import { S3Service } from '@scheduling/lib/aws/s3/s3.service';
import { parseBody } from '@scheduling/lib/aws/lambda/body-parser';
import { S3Event } from 'aws-lambda';
import { FixtureService } from '@schema/fixture/services/fixture.service';
import { FixtureProcessInput, FixtureProcessService } from '@scheduling/lib/fixture/services/fixture-process.service';

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
		const leagueId = parseInt((objectDetails.Metadata || {}).league, 10);
		const monthlyFixtures = JSON.parse(objectDetails.Body!.toString('utf8'));
		const fixtureService = module.get(FixtureService);
		const fixtureProcessService = module.get(FixtureProcessService);
		const dbFixtures = await fixtureService.findByMonth(leagueId, new Date());
		const processingMatches: FixtureProcessInput[] = [];
		const mapping = await fixtureService.saveWhoscoreFixtures(leagueId, dbFixtures, monthlyFixtures);
		for (const [fixture, dbFixture] of mapping.entries()) {
			if (dbFixture.status === 'FT') {
				processingMatches.push({
					matchUrl: fixture.link,
					matchId: dbFixture.id,
					time: dbFixture.time,
				});
			}
		}
		await fixtureProcessService.process(processingMatches);
		return ok('SUCCESS');
	} catch (e) {
		const logger = getLogger(module);
		logger.error(__filename, e);
		return error(e);
	} finally {
		await cleanup();
	}
}
