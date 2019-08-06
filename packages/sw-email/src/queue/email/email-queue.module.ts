import { Inject, Module } from '@nestjs/common';
import { InjectQueue } from 'nest-bull';
import { Queue } from 'bull';
import { CoreModule } from '@core/core.module';
import { EMAIL_LOGGER } from '@core/logging/logging.constant';
import { EMAIL_QUEUE } from '@core/microservices/queue.constants';
import { CoreEmailModule } from '@email/core/core-email.module';
import { BaseQueueModule } from '@core/microservices/base-queue.module';
import { EmailProcessor } from './email.processor';

@Module({
	imports: [BaseQueueModule.forRootAsync(EMAIL_QUEUE), CoreModule, CoreEmailModule],
	providers: [EmailProcessor],
})
export class EmailQueueModule extends BaseQueueModule {
	constructor(@InjectQueue(EMAIL_QUEUE) emailQueue: Queue, @Inject(EMAIL_LOGGER) logger) {
		super(emailQueue, logger);
	}
}
