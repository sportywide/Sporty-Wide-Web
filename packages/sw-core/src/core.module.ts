import { Module } from '@nestjs/common';
import { WorkerModule } from '@core/worker/worker.module';
import { CoreConfigModule } from '@core/config/core-config.module';
import { LoggingModule } from '@core/logging/logging.module';
import { FileModule } from '@core/io/file.module';

@Module({
	imports: [CoreConfigModule, LoggingModule, WorkerModule, FileModule],
	exports: [CoreConfigModule, LoggingModule, WorkerModule, FileModule],
})
export class CoreModule {}
