import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import config from './config';
import schemaConfig from '@schema/config';
console.log(schemaConfig.get('mongo_url'));

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(cors());
	await app.listen(config.get('port') || 5000);
}
bootstrap();
