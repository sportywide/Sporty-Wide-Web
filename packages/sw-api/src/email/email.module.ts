import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { EmailService } from '@api/email/email.service';
import { USER_EMAIL_QUEUE } from '@core/microservices/queue.constants';
import { BaseQueueModule } from '@core/microservices/base-queue.module';

@Module({
	imports: [BaseQueueModule.forRootAsync(USER_EMAIL_QUEUE), CoreModule],
	exports: [EmailService],
	providers: [EmailService],
})
export class EmailModule {}
