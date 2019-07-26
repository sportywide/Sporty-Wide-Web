import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { EmailModule } from './email.module';

let context: INestApplicationContext | null = null;
export const EmailContextFactory = {
	create: async () => {
		if (!context) {
			context = await NestFactory.createApplicationContext(EmailModule);
		}
		return context;
	},
};
