import { NestFactory } from '@nestjs/core';
import { EmailModule } from './email.module';
import { INestApplicationContext } from '@nestjs/common';

let context: INestApplicationContext | null = null;
export const EmailContextFactory = {
	create: async () => {
		if (!context) {
			context = await NestFactory.createApplicationContext(EmailModule);
		}
		return context;
	},
};
