import { Injectable, Inject } from '@nestjs/common';
import { EMAIL_QUEUE } from '@core/microservices/queue.constants';
import { Queue } from 'bull';
import { InjectQueue } from 'nest-bull';
import { API_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';

@Injectable()
export class EmailService {
	constructor(
		@InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
		@Inject(API_LOGGER) private readonly apiLogger: Logger
	) {}

	public sendEmail() {
		try {
			return this.emailQueue.add(12);
		} catch (e) {
			this.apiLogger.error('Failed to send email', e);
		}
	}
}
