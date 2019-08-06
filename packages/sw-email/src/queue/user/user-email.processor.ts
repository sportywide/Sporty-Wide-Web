import { Queue, QueueProcess } from 'nest-bull';
import { Job } from 'bull';
import { USER_EMAIL_QUEUE, USER_SIGNUP_PROCESSOR } from '@core/microservices/queue.constants';
import { EmailService } from '@email/core/email/email.service';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { User } from '@schema/user/models/user.entity';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { MailDto } from '@shared/lib/dtos/email/mail.dto';
import { CORE_CONFIG } from '@core/config/config.constants';
import { Provider } from 'nconf';
import { Inject } from '@nestjs/common';
import { SwQueueProcessor } from '@core/microservices/sw-queue.processor';
import { EMAIL_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';

@Queue({
	name: USER_EMAIL_QUEUE,
})
export class UserEmailProcessor extends SwQueueProcessor {
	constructor(
		private readonly emailService: EmailService,
		@Inject(CORE_CONFIG) private readonly coreConfig: Provider,
		@Inject(EMAIL_LOGGER) logger: Logger,
		@InjectSwRepository(User) private readonly userRepository: SwRepository<User>
	) {
		super(logger);
	}

	@QueueProcess({ name: USER_SIGNUP_PROCESSOR })
	async processUserSignup(job: Job<{ id: number }>) {
		const user = await this.userRepository.findOne(job.data.id);
		if (!user) {
			return;
		}
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

		return this.emailService.sendMail(mailData);
	}
}
