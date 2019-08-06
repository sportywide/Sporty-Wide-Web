import { Queue, QueueProcess } from 'nest-bull';
import { Job } from 'bull';
import { EMAIL_QUEUE } from '@core/microservices/queue.constants';
import Mail from 'nodemailer/lib/mailer';
import { EmailService } from '@email/core/email/email.service';

@Queue({
	name: EMAIL_QUEUE,
})
export class EmailProcessor {
	constructor(private emailService: EmailService) {}

	@QueueProcess()
	async processEmail(job: Job<Mail.Options>) {
		await this.emailService.sendMail(job.data);
	}
}
