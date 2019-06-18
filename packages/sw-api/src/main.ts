import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import config from './config';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
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
	await app.listen(config.get('port') || 5000);
}

bootstrap();
