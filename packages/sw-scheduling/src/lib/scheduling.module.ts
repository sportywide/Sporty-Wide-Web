process.env.TZ = 'UTC';

import { INestApplicationContext, Module } from '@nestjs/common';
import { CoreSchedulingModule } from '@scheduling/lib/core/core.module';
import { NestFactory } from '@nestjs/core';
import { AwsModule } from '@scheduling/lib/aws/aws.module';
import { PersisterModule } from '@data/persister/persister.module';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { getConnectionManager } from 'typeorm';
import mongoose from 'mongoose';

@Module({
	imports: [CoreSchedulingModule, CrawlerModule, AwsModule],
})
export class SchedulingCrawlerModule {}

@Module({
	imports: [CoreSchedulingModule, PersisterModule, AwsModule],
})
export class SchedulingPersisterModule {}

export async function cleanup() {
	try {
		const connectionManager = getConnectionManager();
		const defaultConnection = connectionManager.get('default');
		if (defaultConnection.isConnected) {
			await defaultConnection.close();
		}
		await mongoose.disconnect();
	} catch (e) {
		console.error('Failed to clean up', e);
	}
}

export async function initModule(moduleClass) {
	return NestFactory.createApplicationContext(moduleClass);
}
