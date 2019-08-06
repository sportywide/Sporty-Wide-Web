import { Queue, QueueProcess } from 'nest-bull';
import { Job } from 'bull';
import { EMAIL_QUEUE } from '@core/microservices/queue.constants';
import Mail from 'nodemailer/lib/mailer';
import { EmailService } from '@email/core/email/email.service';
import { EMAIL_LOGGER } from '@core/logging/logging.constant';
import { Logger } from 'log4js';
import { Inject } from '@nestjs/common';
import { SwQueueProcessor } from '@core/microservices/sw-queue.processor';

@Queue({
	name: EMAIL_QUEUE,
})
export class EmailProcessor extends SwQueueProcessor {
	constructor(private emailService: EmailService, @Inject(EMAIL_LOGGER) logger: Logger) {
		super(logger);
	}

	@QueueProcess()
	async processEmail(job: Job<Mail.Options>) {
		await this.emailService.sendMail(job.data);
	}
}
