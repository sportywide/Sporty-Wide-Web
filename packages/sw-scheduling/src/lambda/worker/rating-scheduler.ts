import { error, ok } from '@scheduling/lib/http';
import { FixtureProcessService } from '@scheduling/lib/fixture/services/fixture-process.service';
import { cleanup, initModule, SchedulingPersisterModule } from '@scheduling/lib/scheduling.module';
import { SqsService } from '@scheduling/lib/aws/sqs/sqs.service';

export async function handler(event, context) {
	try {
		const module = await initModule(SchedulingPersisterModule);
		context.callbackWaitsForEmptyEventLoop = false;
		const fixtureProcessService = module.get(FixtureProcessService);
		const readyFixtures = await fixtureProcessService.findReadyFixtures();
		const sqsService = module.get(SqsService);
		await Promise.all(
			readyFixtures.map(readyFixture =>
				sqsService.sendMessage({
					MessageBody: JSON.stringify(readyFixture),
					Queue: 'rating-queue',
				})
			)
		);
		return ok('SUCCESS');
	} catch (e) {
		console.error(__filename, e);
		return error(e);
	} finally {
		await cleanup();
	}
}
