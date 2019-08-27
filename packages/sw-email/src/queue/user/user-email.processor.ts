import { Queue, QueueProcess } from 'nest-bull';
import { Job } from 'bull';
import { USER_EMAIL_QUEUE, USER_SIGNUP_PROCESSOR } from '@core/microservices/queue.constants';
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
		const [compiledTemplate, baseCss, verifyEmailCss] = await Promise.all([
			this.templateService.compile('verify-email.pug'),
			this.stylesheetService.css('basscss.min.css'),
			this.stylesheetService.css('verify-email.min.css'),
		]);
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
			html: this.templateService.injectCss(
				compiledTemplate({
					appUrl: this.emailConfig.get('app:url'),
					title: 'Please confirm your email',
					token: token.content,
					userId: user.id,
				}),
				baseCss + verifyEmailCss
			),
		};

		return this.emailService.sendMail(mailData);
	}
}
