import { networkLogOptions } from '@shared/lib/utils/logging/layout';

process.env.TZ = 'UTC';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { LOG4J_PROVIDER } from '@core/logging/logging.constant';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { API_CONFIG } from '@core/config/config.constants';
import passport from 'passport';
import express from 'express';
import { bugsnagClient } from '@api/utils/bugsnag';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
	const server = express();
	const middleware = bugsnagClient.getPlugin('express');
	const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
	app.use(middleware.requestHandler);
	app.use(helmet());
	app.use(cookieParser());
	app.use(passport.initialize());
	app.use(cors());
	app.use((req, res, next) => {
		res.setHeader('Expires', '-1');
		res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
		next();
	});
	const log4js = app.get(LOG4J_PROVIDER);
	app.use(log4js.connectLogger(log4js.getLogger('api-http'), networkLogOptions));
	app.use(middleware.errorHandler);
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
