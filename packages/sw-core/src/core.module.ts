import { Module } from '@nestjs/common';
import { WorkerModule } from '@core/worker/worker.module';
import { CoreConfigModule } from '@core/config/core-config.module';
import { LoggingModule } from '@core/logging/logging.module';
import { FileModule } from '@core/io/file.module';
import { RedisModule } from '@core/redis/redis.module';
import { AwsModule } from '@core/aws/aws.module';

@Module({
	imports: [CoreConfigModule, LoggingModule, WorkerModule, FileModule, RedisModule, AwsModule],
	exports: [CoreConfigModule, LoggingModule, WorkerModule, FileModule, RedisModule, AwsModule],
})
export class CoreModule {}
