import { Module, INestApplicationContext } from '@nestjs/common';
import { CoreSchedulingModule } from '@scheduling/lib/core/core.module';
import { CrawlerModule } from '@data/crawler/crawler.module';
import { NestFactory } from '@nestjs/core';
import { AwsModule } from '@scheduling/lib/aws/aws.module';

@Module({
	imports: [CoreSchedulingModule, CrawlerModule, AwsModule],
})
export class SchedulingModule {}

let module: INestApplicationContext;

export async function initModule() {
	if (module) {
		return module;
	}

	module = await NestFactory.createApplicationContext(SchedulingModule);
	return module;
}
