import nodemailer, { Transporter } from 'nodemailer';
import { EMAIL_CONFIG } from '@core/config/config.constants';
import { Provider } from 'nconf';
import { EMAIL_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Inject, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
const isProduction = process.env.NODE_ENV === 'production';

@Injectable()
export class EmailService {
	private transporter: Transporter;

	constructor(
		@Inject(EMAIL_CONFIG) private readonly emailConfig: Provider,
		@Inject(EMAIL_LOGGER) private readonly logger: Logger
	) {
		const transportOptions: SMTPTransport.Options = {
			host: emailConfig.get('smtp:host'),
			port: emailConfig.get('smtp:port'),
			secure: isProduction,
			tls: {
				rejectUnauthorized: isProduction,
			},
		};

		if (isProduction) {
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
}
