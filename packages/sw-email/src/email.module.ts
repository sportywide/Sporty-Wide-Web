import { Module } from '@nestjs/common';
import { CoreEmailModule } from '@email/core/core-email.module';
import { BullQueueModule } from '@email/core/queue/bull-queue.module';

@Module({
	imports: [CoreEmailModule, BullQueueModule],
	controllers: [],
})
export class EmailModule {}
