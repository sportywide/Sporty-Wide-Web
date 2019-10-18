import { Module } from '@nestjs/common';
import { WorkerQueueService } from '@core/worker/worker-queue.service';

@Module({
	providers: [WorkerQueueService],
	exports: [WorkerQueueService],
})
export class WorkerModule {}
