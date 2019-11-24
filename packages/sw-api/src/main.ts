process.env.TZ = 'UTC';
import { NestFactory } from '@nestjs/core';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { LOG4J_PROVIDER } from '@core/logging/logging.constant';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_CONFIG } from '@core/config/config.constants';
import passport from 'passport';
import { AppModule } from './app.module';
declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(helmet());
	app.use(cookieParser());
	app.use(passport.initialize());
	app.use(cors());
	const log4js = app.get(LOG4J_PROVIDER);
	app.use(
		log4js.connectLogger(log4js.getLogger('http'), {
			level: 'INFO',
			nolog: '\\.js|\\.css|\\.png',
		})
	);

	const options = new DocumentBuilder()
		.setTitle('SportyWide API')
		.setDescription('SportyWide API description')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('doc', app, document);

	const config = app.get(API_CONFIG);

	await app.listen(config.get('port') || 5000);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}

bootstrap();
