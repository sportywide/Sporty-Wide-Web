import { Module, Inject } from '@nestjs/common';
import { BullModule, InjectQueue } from 'nest-bull';
import { Queue } from 'bull';
import config from '@core/config';
import { CoreModule } from '@core/core.module';
import { EMAIL_LOGGER } from '@core/logging/logging.constant';
import { EmailProcessor } from '@email/core/queue/processor/email.processor';
import { EMAIL_QUEUE } from '@core/microservices/queue.constants';

@Module({
	imports: [
		BullModule.forRoot({
			name: EMAIL_QUEUE,
			options: {
				redis: {
					host: config.get('redis:host'),
					port: config.get('redis:port'),
				},
			},
		}),
		CoreModule,
	],
	providers: [EmailProcessor],
	controllers: [],
})
export class BullQueueModule {
	constructor(@InjectQueue(EMAIL_QUEUE) readonly emailQueue: Queue, @Inject(EMAIL_LOGGER) private readonly logger) {}

	onModuleInit() {
		this.emailQueue.on('completed', () => {
			this.logger.info('Email sent successfully');
		});

		this.emailQueue.on('failed', (job, err) => {
			this.logger.error(err);
		});
	}
}
