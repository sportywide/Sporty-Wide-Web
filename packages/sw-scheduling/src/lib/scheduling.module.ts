import { SimpleLoggerService } from '@scheduling/lib/simple-logger.service';
import { Module } from '@nestjs/common';
import { CoreSchedulingModule } from '@scheduling/lib/core/core.module';
import { NestFactory } from '@nestjs/core';
import { PersisterModule } from '@data/persister/persister.module';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { getConnectionManager } from 'typeorm';
import { DataModule } from '@data/data.module';
import mongoose from 'mongoose';
import { FixtureModule } from '@scheduling/lib/fixture/fixture.module';
import { SCHEDULING_LOGGER } from '@core/logging/logging.constant';

process.env.TZ = 'UTC';

@Module({
	imports: [CoreSchedulingModule, FixtureModule, CrawlerModule],
})
export class SchedulingCrawlerModule {}

@Module({
	imports: [CoreSchedulingModule, FixtureModule, DataModule],
})
export class SchedulingModule {}

@Module({
	imports: [CoreSchedulingModule, FixtureModule, PersisterModule],
})
export class SchedulingPersisterModule {}

export async function cleanup() {
	try {
		const connectionManager = getConnectionManager();
		if (connectionManager.has('default')) {
			const defaultConnection = connectionManager.get('default');
			if (defaultConnection.isConnected) {
				await defaultConnection.close();
			}
		}
		await mongoose.disconnect();
	} catch (e) {
		console.error('Failed to clean up', e);
	}
}

export async function initModule(moduleClass) {
	return NestFactory.createApplicationContext(moduleClass, {
		logger: new SimpleLoggerService(),
	});
}

export function getLogger(module) {
	const logger = module && module.get(SCHEDULING_LOGGER);
	return logger || console;
}
