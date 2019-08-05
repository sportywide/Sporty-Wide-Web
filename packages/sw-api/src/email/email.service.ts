import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_QUEUE } from '@core/microservices/queue.constants';
import { Queue } from 'bull';
import { InjectQueue } from 'nest-bull';
import { API_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { MailDto } from '@shared/lib/dtos/email/mail.dto';
import { Provider } from 'nconf';
import { User } from '@schema/user/models/user.entity';
import { CORE_CONFIG } from '@core/config/config.constants';

@Injectable()
export class EmailService {
	constructor(
		@InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
		@Inject(API_LOGGER) private readonly apiLogger: Logger,
		@Inject(CORE_CONFIG) private readonly coreConfig: Provider
	) {}

	public sendUserVerificationEmail(user: User) {
		try {
			const mailData: MailDto = {
				from: {
					address: this.coreConfig.get('support_user:email'),
					name: this.coreConfig.get('support_user:name'),
				},
				to: {
					address: user.email,
					name: user.name,
				},
				subject: 'You have signed up for sportywide',
				html: '<b>Please click on the link below to finish signup</b>',
			};
			return this.emailQueue.add(mailData);
		} catch (e) {
			this.apiLogger.error('Failed to send email', e);
		}
	}
}