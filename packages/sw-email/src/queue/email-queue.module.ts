import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { EMAIL_QUEUE, USER_EMAIL_QUEUE } from '@core/microservices/queue.constants';
import { CoreEmailModule } from '@email/core/core-email.module';
import { SwQueueModule } from '@core/microservices/sw-queue.module';
import { SchemaModule } from '@schema/schema.module';
import { UserEmailProcessor } from '@email/queue/user/user-email.processor';
import { EmailProcessor } from '@email/queue/email/email.processor';

@Module({
	imports: [SwQueueModule.forRootAsync([USER_EMAIL_QUEUE, EMAIL_QUEUE]), CoreModule, CoreEmailModule, SchemaModule],
	providers: [UserEmailProcessor, EmailProcessor],
})
export class EmailQueueModule {}
