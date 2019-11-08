import { INestApplicationContext, Module } from '@nestjs/common';
import { CoreSchedulingModule } from '@scheduling/lib/core/core.module';
import { NestFactory } from '@nestjs/core';
import { AwsModule } from '@scheduling/lib/aws/aws.module';
import { DataModule } from '@data/data.module';

@Module({
	imports: [CoreSchedulingModule, DataModule, AwsModule],
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
