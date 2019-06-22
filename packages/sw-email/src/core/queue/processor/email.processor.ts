import { Queue, QueueProcess } from 'nest-bull';
import { Job } from 'bull';
import { Inject } from '@nestjs/common';
import { EMAIL_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { EMAIL_QUEUE } from '@core/microservices/queue.constants';

@Queue({
	name: EMAIL_QUEUE,
})
export class EmailProcessor {
	constructor(@Inject(EMAIL_LOGGER) private readonly logger: Logger) {}

	@QueueProcess()
	processEmail(job: Job<number>) {
		this.logger.debug('Sending email');
		return 1;
	}
}
