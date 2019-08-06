import { Inject, Module } from '@nestjs/common';
import { InjectQueue } from 'nest-bull';
import { Queue } from 'bull';
import { CoreModule } from '@core/core.module';
import { EMAIL_LOGGER } from '@core/logging/logging.constant';
import { USER_EMAIL_QUEUE } from '@core/microservices/queue.constants';
import { CoreEmailModule } from '@email/core/core-email.module';
import { BaseQueueModule } from '@core/microservices/base-queue.module';
import { SchemaModule } from '@schema/schema.module';
import { UserEmailProcessor } from './user-email.processor';

@Module({
	imports: [BaseQueueModule.forRootAsync(USER_EMAIL_QUEUE), CoreModule, CoreEmailModule, SchemaModule],
	providers: [UserEmailProcessor],
})
export class UserEmailQueueModule extends BaseQueueModule {
	constructor(@InjectQueue(USER_EMAIL_QUEUE) emailQueue: Queue, @Inject(EMAIL_LOGGER) logger) {
		super(emailQueue, logger);
	}
}
