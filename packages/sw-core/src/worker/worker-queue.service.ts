import { Injectable } from '@nestjs/common';
import { WorkerQueue } from '@shared/lib/utils/queue/worker-queue.class';

@Injectable()
export class WorkerQueueService {
	newWorker({ worker, maximumWorkers = 10, logger }: { maximumWorkers?: number; worker: Function; logger?: any }) {
		return new WorkerQueue({
			worker,
			maximumWorkers,
			logger,
		});
	}
}
