process.env.TZ = 'UTC';
import { EmailContextFactory } from '@email/email.context';

async function bootstrap() {
	return EmailContextFactory.create();
}

bootstrap();
