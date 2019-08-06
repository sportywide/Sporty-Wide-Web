import { Logger } from 'log4js';
import { OnQueueEvent, BullQueueEvents } from 'nest-bull';
import { Job } from 'bull';

export class SwQueueProcessor {
	constructor(private logger: Logger) {}

	@OnQueueEvent(BullQueueEvents.COMPLETED)
	onCompleted(job: Job) {
		this.logger.debug(`${this.getLabel(job)}: Job has completed`);
	}

	@OnQueueEvent(BullQueueEvents.FAILED)
	onFailed(job: Job, err) {
		this.logger.error(`${this.getLabel(job)}: Job has failed`, err);
	}

	private getLabel(job: Job) {
		return `Queue ${job.queue.name} - Processor ${job.name}`;
	}
}
