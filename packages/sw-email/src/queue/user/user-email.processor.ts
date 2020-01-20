import { Queue, QueueProcess } from 'nest-bull';
import { Job } from 'bull';
import {
	USER_EMAIL_QUEUE,
	USER_FORGOT_PASSWORD_PROCESSOR,
	USER_SIGNUP_PROCESSOR,
} from '@core/microservices/queue.constants';
import { EmailService } from '@email/core/email/email.service';
import { InjectSwRepository } from '@schema/core/repository/sql/inject-repository.decorator';
import { User } from '@schema/user/models/user.entity';
import { SwRepository } from '@schema/core/repository/sql/base.repository';
import { MailDto } from '@shared/lib/dtos/email/mail.dto';
import { CORE_CONFIG, EMAIL_CONFIG } from '@core/config/config.constants';
import { Provider } from 'nconf';
import { Inject } from '@nestjs/common';
import { SwQueueProcessor } from '@core/microservices/sw-queue.processor';
import { EMAIL_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { TemplateService } from '@email/core/email/template/template.service';
import { fromString } from 'html-to-text';
import { RedisService } from '@core/redis/redis.service';
import { forgotPasswordKey, verifyEmailKey } from '@core/redis/redis.constants';

@Queue({
	name: USER_EMAIL_QUEUE,
})
export class UserEmailProcessor extends SwQueueProcessor {
	constructor(
		private readonly emailService: EmailService,
		@Inject(CORE_CONFIG) private readonly coreConfig: Provider,
		@Inject(EMAIL_CONFIG) private readonly emailConfig: Provider,
		@Inject(EMAIL_LOGGER) logger: Logger,
		@InjectSwRepository(User) private readonly userRepository: SwRepository<User>,
		private readonly redisService: RedisService,
		private readonly templateService: TemplateService
	) {
		super(logger);
	}

	@QueueProcess({ name: USER_SIGNUP_PROCESSOR })
	async processUserSignup(job: Job<{ id: number }>) {
		const user = await this.userRepository.findOne(job.data.id);
		if (!user) {
			throw new Error('User does not exist');
		}
		const redisKey = verifyEmailKey(user.id);
		const token = await this.redisService.client.get(redisKey);
		if (!token) {
			throw new Error('Token does not exist');
		}
		const { template, css } = await this.emailService.getEmailContent({
			templateFile: 'auth/verify-email.pug',
			cssFile: 'verify-email.min.css',
		});
		const html = this.templateService.injectCss(
			template({
				appUrl: this.emailConfig.get('app:url'),
				title: 'Please confirm your email',
				token: token,
				userId: user.id,
			}),
			css
		);
		const mailData: MailDto = {
			from: this.emailService.getSupportUserEmail(),
			to: this.emailService.getUserEmail(user),
			subject: 'You have signed up for sportywide',
			html,
			text: fromString(html),
		};

		return this.emailService.sendMail(mailData);
	}

	@QueueProcess({ name: USER_FORGOT_PASSWORD_PROCESSOR })
	async processUserForgotPassword(job: Job<{ id: number }>) {
		const user = await this.userRepository.findOne(job.data.id);
		if (!user) {
			throw new Error('User does not exist');
		}
		const redisKey = forgotPasswordKey(user.id);
		const token = await this.redisService.client.get(redisKey);
		if (!token) {
			throw new Error('Token does not exist');
		}
		const { template, css } = await this.emailService.getEmailContent({
			templateFile: 'auth/forgot-password.pug',
			cssFile: 'forgot-password.min.css',
		});
		const html = this.templateService.injectCss(
			template({
				appUrl: this.emailConfig.get('app:url'),
				title: 'Please click the url to reset your password',
				token: token,
				username: user.name,
			}),
			css
		);
		const mailData: MailDto = {
			from: this.emailService.getSupportUserEmail(),
			to: this.emailService.getUserEmail(user),
			subject: 'Reset your password',
			html,
			text: fromString(html),
		};

		return this.emailService.sendMail(mailData);
	}
}
