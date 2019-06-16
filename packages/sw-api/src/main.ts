import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import config from './config';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(helmet());
	app.use(cookieParser());
	app.use(cors());
	//app.use(csurf({ cookie: true }));
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		})
	);
	await app.listen(config.get('port') || 5000);
}
bootstrap();
