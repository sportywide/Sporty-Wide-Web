import { leagues } from '@data/data.constants';
import { initModule } from '@scheduling/lib/scheduling.module';
import { AwsModule } from '@scheduling/lib/aws/aws.module';
import { SqsService } from '@scheduling/lib/aws/sqs/sqs.service';

export async function handler() {
	const awsModule = await initModule(AwsModule);
	const sqsService = awsModule.get(SqsService);
	await Promise.all(
		leagues.map(league => {
			sqsService.sendMessage({
				Queue: 'scoreboard-team-queue',
				MessageBody: String(league.id),
			});
		})
	);
}
