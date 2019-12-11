import { leagues } from '@shared/lib/data/data.constants';
import { initModule } from '@scheduling/lib/scheduling.module';
import { AwsModule } from '@scheduling/lib/aws/aws.module';
import { SqsService } from '@scheduling/lib/aws/sqs/sqs.service';

export async function handler() {
	const awsModule = await initModule(AwsModule);
	const sqsService = awsModule.get(SqsService);
	try {
		await Promise.all(
			leagues.map(async league =>
				sqsService.sendMessage({
					Queue: 'scoreboard-team-queue',
					MessageBody: String(league.id),
				})
			)
		);
	} catch (e) {
		console.error(__filename, e);
	}
}
