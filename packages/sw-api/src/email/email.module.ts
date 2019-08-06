import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { EmailService } from '@api/email/email.service';
import { USER_EMAIL_QUEUE } from '@core/microservices/queue.constants';
import { SwQueueModule } from '@core/microservices/sw-queue.module';

@Module({
	imports: [SwQueueModule.forRootAsync([USER_EMAIL_QUEUE]), CoreModule],
	exports: [EmailService],
	providers: [EmailService],
})
export class EmailModule {}
