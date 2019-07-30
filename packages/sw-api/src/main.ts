import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { LOG4J_PROVIDER } from '@core/logging/logging.constant';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_CONFIG } from '@core/config/config.constants';
import { AppModule } from './app.module';

const CSRF_WHITE_LIST = ['login', 'signup'];
const isProduction = process.env.NODE_ENV === 'production';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(helmet());
	app.use(cookieParser());
	app.use(cors());
	app.use(
		csurf({
			cookie: {
				secure: isProduction,
			},
			whitelist: req => {
				return CSRF_WHITE_LIST.some(whiteListPath => req.path && req.path.endsWith(whiteListPath));
			},
		})
	);
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
}

bootstrap();
