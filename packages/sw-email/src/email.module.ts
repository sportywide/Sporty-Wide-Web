import { Module } from '@nestjs/common';
import { CoreEmailModule } from '@email/core/core-email.module';
import { EmailQueueModule } from '@email/queue/email-queue.module';

@Module({
	imports: [CoreEmailModule, EmailQueueModule],
	controllers: [],
})
export class EmailModule {}
