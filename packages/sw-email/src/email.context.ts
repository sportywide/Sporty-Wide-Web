import { NestFactory } from '@nestjs/core';
import { EmailModule } from './email.module';
import { INestApplication } from '@nestjs/common';

let context: INestApplication | null = null;
export const EmailContext = async () => {
	if (!context) {
		context = await NestFactory.create(EmailModule);
	}
	return context;
};
