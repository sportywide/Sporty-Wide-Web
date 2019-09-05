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
import { Token } from '@schema/auth/models/token.entity';
import { TokenType } from '@schema/auth/models/enums/token-type.token';
import { StylesheetService } from '@email/core/email/styles/styles.service';
import { TemplateService } from '@email/core/email/template/template.service';

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
		@InjectSwRepository(Token) private readonly tokenRepository: SwRepository<Token>,
		private readonly stylesheetService: StylesheetService,
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
		const token = await this.tokenRepository.findOne({
			where: {
				engagementTable: this.userRepository.getTableName(),
				engagementId: user.id,
				type: TokenType.CONFIRM_EMAIL,
			},
		});
		if (!token) {
			throw new Error('Token does not exist');
		}
		const { template, css } = await this.getEmailContent({
			templateFile: 'auth/verify-email.pug',
			cssFile: 'verify-email.min.css',
		});
		const mailData: MailDto = {
			from: this.getSupportUserEmail(),
			to: this.getUserEmail(user),
			subject: 'You have signed up for sportywide',
			html: this.templateService.injectCss(
				template({
					appUrl: this.emailConfig.get('app:url'),
					title: 'Please confirm your email',
					token: token.content,
					userId: user.id,
				}),
				css
			),
		};

		return this.emailService.sendMail(mailData);
	}

	@QueueProcess({ name: USER_FORGOT_PASSWORD_PROCESSOR })
	async processUserForgotPassword(job: Job<{ id: number }>) {
		const user = await this.userRepository.findOne(job.data.id);
		if (!user) {
			throw new Error('User does not exist');
		}
		const token = await this.tokenRepository.findOne({
			where: {
				engagementTable: this.userRepository.getTableName(),
				engagementId: user.id,
				type: TokenType.FORGOT_PASSWORD,
			},
		});
		if (!token) {
			throw new Error('Token does not exist');
		}
		const { template, css } = await this.getEmailContent({
			templateFile: 'auth/forgot-password.pug',
			cssFile: 'forgot-password.min.css',
		});
		const mailData: MailDto = {
			from: this.getSupportUserEmail(),
			to: this.getUserEmail(user),
			subject: 'Reset your password',
			html: this.templateService.injectCss(
				template({
					appUrl: this.emailConfig.get('app:url'),
					title: 'Please click the url to reset your password',
					token: token.content,
				}),
				css
			),
		};

		return this.emailService.sendMail(mailData);
	}

	private getSupportUserEmail() {
		return {
			address: this.coreConfig.get('support_user:email'),
			name: this.coreConfig.get('support_user:name'),
		};
	}

	private getUserEmail(user: User) {
		return {
			address: user.email,
			name: user.name,
		};
	}

	private async getEmailContent({ templateFile, cssFile }: { templateFile: string; cssFile: string }) {
		const [compiledTemplate, baseCss, emailCss] = await Promise.all([
			this.templateService.compile(templateFile),
			this.stylesheetService.css('basscss.min.css'),
			cssFile ? this.stylesheetService.css(cssFile) : Promise.resolve(''),
		]);

		return {
			template: compiledTemplate,
			css: baseCss + emailCss,
		};
	}
}
