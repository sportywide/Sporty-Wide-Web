declare const module: any;

import { EmailContextFactory } from '@email/email.context';

async function bootstrap() {
	const app = await EmailContextFactory.create();

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}

bootstrap();
