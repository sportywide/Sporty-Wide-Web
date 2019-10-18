import { Module } from '@nestjs/common';
import { ConfigModule } from '@core/config/config.module';
import { CORE_CONFIG } from '@core/config/config.constants';
import { LoggerProviderFactory } from '@core/logging/logger-provider.factory';
import { log4jsProviders } from '@core/logging/logger.providers';
import { fileProvider } from '@core/io/file.provider';
import { config } from '@core/config';
import { WorkerModule } from '@core/worker/worker.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			config,
			exportAs: CORE_CONFIG,
		}),
		WorkerModule,
	],
	providers: [LoggerProviderFactory, ...log4jsProviders, fileProvider],
	exports: [ConfigModule, WorkerModule, LoggerProviderFactory, ...log4jsProviders, fileProvider],
})
export class CoreModule {}
