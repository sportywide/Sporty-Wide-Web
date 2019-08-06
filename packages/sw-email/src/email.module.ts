import { Module } from '@nestjs/common';
import { CoreEmailModule } from '@email/core/core-email.module';
import { UserEmailQueueModule } from '@email/queue/user/user-email-queue.module';

@Module({
	imports: [CoreEmailModule, UserEmailQueueModule],
	controllers: [],
})
export class EmailModule {}
