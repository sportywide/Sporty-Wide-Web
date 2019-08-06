import { Inject, Injectable } from '@nestjs/common';
import { USER_EMAIL_QUEUE, USER_SIGNUP_PROCESSOR } from '@core/microservices/queue.constants';
import { Queue } from 'bull';
import { InjectQueue } from 'nest-bull';
import { API_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { User } from '@schema/user/models/user.entity';

@Injectable()
export class EmailService {
	constructor(
		@InjectQueue(USER_EMAIL_QUEUE) private readonly userEmailQueue: Queue,
		@Inject(API_LOGGER) private readonly apiLogger: Logger
	) {}

	public sendUserVerificationEmail(user: User) {
		this.apiLogger.debug(`Sending signup email to ${user.username}`);
		try {
			return this.userEmailQueue.add(USER_SIGNUP_PROCESSOR, {
				id: user.id,
			});
		} catch (e) {
			this.apiLogger.error('Failed to send email', e);
		}
	}
}
