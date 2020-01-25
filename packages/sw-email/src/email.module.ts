import { Module } from '@nestjs/common';
import { CoreEmailModule } from '@email/core/core-email.module';
import { EmailQueueModule } from '@email/queue/email-queue.module';
import { CronModule } from '@email/cron/cron.module';

@Module({
	imports: [CoreEmailModule, EmailQueueModule, CronModule],
	controllers: [],
})
export class EmailModule {}
