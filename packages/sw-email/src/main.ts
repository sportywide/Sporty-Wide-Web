import { EmailContext } from '@email/email.context';

async function bootstrap() {
	const app = await EmailContext();

	app.init();
}

bootstrap();
