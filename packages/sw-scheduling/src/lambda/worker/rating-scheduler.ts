import { error, ok } from '@scheduling/lib/http';
import { INestApplicationContext } from '@nestjs/common';
import { FixtureProcessService } from '@scheduling/lib/fixture/services/fixture-process.service';
import { cleanup, getLogger, initModule, SchedulingPersisterModule } from '@scheduling/lib/scheduling.module';
import { SqsService } from '@core/aws/sqs/sqs.service';

export async function handler(event, context) {
	let module: INestApplicationContext;
	try {
		module = await initModule(SchedulingPersisterModule);
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
		const logger = getLogger(module);
		logger.error(__filename, e);
		return error(e);
	} finally {
		await cleanup();
	}
}
