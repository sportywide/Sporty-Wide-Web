import nodemailer, { Transporter } from 'nodemailer';
import { CORE_CONFIG, EMAIL_CONFIG } from '@core/config/config.constants';
import { Provider } from 'nconf';
import { EMAIL_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Inject, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { isProduction } from '@shared/lib/utils/env';
import { User } from '@schema/user/models/user.entity';
import { StylesheetService } from '@email/core/email/styles/styles.service';
import { TemplateService } from '@email/core/email/template/template.service';

@Injectable()
export class EmailService {
	private transporter: Transporter;

	constructor(
		@Inject(EMAIL_CONFIG) private readonly emailConfig: Provider,
		@Inject(CORE_CONFIG) private readonly coreConfig: Provider,
		@Inject(EMAIL_LOGGER) private readonly logger: Logger,
		private readonly stylesheetService: StylesheetService,
		private readonly templateService: TemplateService
	) {
		const transportOptions: SMTPTransport.Options = {
			host: emailConfig.get('smtp:host'),
			port: emailConfig.get('smtp:port'),
			secure: isProduction(),
			tls: {
				rejectUnauthorized: isProduction(),
			},
		};

		if (isProduction()) {
			transportOptions.auth = {
				user: emailConfig.get('smtp:user'),
				pass: emailConfig.get('smtp:password'),
			};
		}

		this.transporter = nodemailer.createTransport(transportOptions);
	}

	sendMail(mailOptions: Mail.Options) {
		this.logger.debug('Sending email');
		return this.transporter.sendMail(mailOptions);
	}

	getSupportUserEmail() {
		return {
			address: this.coreConfig.get('support_user:email'),
			name: this.coreConfig.get('support_user:name'),
		};
	}

	getUserEmail(user: User) {
		return {
			address: user.email,
			name: user.name,
		};
	}

	async getEmailContent({ templateFile, cssFile }: { templateFile: string; cssFile: string }) {
		const [compiledTemplate, coreStyles, emailCss] = await Promise.all([
			this.templateService.compile(templateFile),
			this.stylesheetService.css('styles.min.css'),
			cssFile ? this.stylesheetService.css(cssFile) : Promise.resolve(''),
		]);

		return {
			template: compiledTemplate,
			css: coreStyles + emailCss,
		};
	}
}
