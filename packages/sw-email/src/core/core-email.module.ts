import { Module } from '@nestjs/common';
import { configProvider } from '@email/core/config/config.provider';
import { CoreModule } from '@core/core.module';
import { BullQueueModule } from '@email/core/queue/bull-queue.module';

@Module({
	exports: [configProvider],
	providers: [configProvider],
	imports: [CoreModule, BullQueueModule],
})
export class CoreEmailModule {}
