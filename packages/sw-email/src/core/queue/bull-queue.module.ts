import { Module, Inject } from '@nestjs/common';
import { BullModule, InjectQueue } from 'nest-bull';
import { Queue } from 'bull';
import { CoreModule } from '@core/core.module';
import { EMAIL_LOGGER } from '@core/logging/logging.constant';
import { EmailProcessor } from '@email/core/queue/processor/email.processor';
import { EMAIL_QUEUE } from '@core/microservices/queue.constants';
import { CoreEmailModule } from '@email/core/core-email.module';
import { Provider } from 'nconf';
import { CORE_CONFIG } from '@core/config/config.constants';

@Module({
	imports: [
		BullModule.forRootAsync({
			name: EMAIL_QUEUE,
			imports: [CoreModule],
			inject: [CORE_CONFIG],
			useFactory: (coreConfig: Provider) => {
				return {
					options: {
						redis: {
							host: coreConfig.get('redis:host'),
							port: coreConfig.get('redis:port'),
						},
					},
				};
			},
		}),
		CoreModule,
		CoreEmailModule,
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
