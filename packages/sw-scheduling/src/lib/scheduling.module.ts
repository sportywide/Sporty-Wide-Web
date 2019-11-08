import { INestApplicationContext, Module } from '@nestjs/common';
import { CoreSchedulingModule } from '@scheduling/lib/core/core.module';
import { NestFactory } from '@nestjs/core';
import { AwsModule } from '@scheduling/lib/aws/aws.module';
import { DataModule } from '@data/data.module';
import { PersisterModule } from '@data/persister/persister.module';
import { CrawlerModule } from '@data/crawler/crawler.module';

@Module({
	imports: [CoreSchedulingModule, DataModule, AwsModule],
})
export class SchedulingModule {}

@Module({
	imports: [CoreSchedulingModule, CrawlerModule, AwsModule],
})
export class SchedulingCrawlerModule {}

@Module({
	imports: [CoreSchedulingModule, PersisterModule, AwsModule],
})
export class SchedulingPersisterModule {}

const moduleMap: Map<any, INestApplicationContext> = new Map<any, INestApplicationContext>();

export async function initModule(moduleClass) {
	let module = moduleMap.get(moduleClass);
	if (module) {
		return module;
	}

	module = await NestFactory.createApplicationContext(SchedulingModule, {
		logger: false,
	});
	moduleMap.set(moduleClass, module);
	return module;
}
