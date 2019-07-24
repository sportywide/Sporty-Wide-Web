import { Queue, QueueProcess } from 'nest-bull';
import { Job } from 'bull';
import { Inject } from '@nestjs/common';
import { EMAIL_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { EMAIL_QUEUE } from '@core/microservices/queue.constants';
import nodemailer, { Transporter } from 'nodemailer';
import { Provider } from 'nconf';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';
import { EMAIL_CONFIG } from '@core/config/config.constants';
const isProduction = process.env.NODE_ENV === 'production';

@Queue({
	name: EMAIL_QUEUE,
})
export class EmailProcessor {
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

	@QueueProcess()
	async processEmail(job: Job<Mail.Options>) {
		this.logger.debug('Sending email');
		await this.transporter.sendMail(job.data);
	}
}
