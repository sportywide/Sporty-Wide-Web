import { leagues } from '@shared/lib/data/data.constants';
import { INestApplicationContext } from '@nestjs/common';
import { getLogger, initModule, SchedulingCrawlerModule } from '@scheduling/lib/scheduling.module';
import { SqsService } from '@core/aws/sqs/sqs.service';

export async function handler() {
	let module: INestApplicationContext;
	try {
		module = await initModule(SchedulingCrawlerModule);
		const sqsService = module.get(SqsService);
		await Promise.all(
			leagues.map(async league =>
				sqsService.sendMessage({
					Queue: 'scoreboard-team-queue',
					MessageBody: String(league.id),
				})
			)
		);
	} catch (e) {
		const logger = getLogger(module);
		logger.error(__filename, e);
	}
}
