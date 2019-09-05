import path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@core/config/config.module';
import { CORE_CONFIG } from '@core/config/config.constants';
import { LoggerProviderFactory } from '@core/logging/logger-provider.factory';
import { log4jsProviders } from '@core/logging/logger.providers';
import { fileProvider } from '@core/io/file.provider';

@Module({
	imports: [
		ConfigModule.forRoot({
			configFile: path.resolve(__dirname, 'sw-core', 'config'),
			exportAs: CORE_CONFIG,
		}),
	],
	providers: [LoggerProviderFactory, ...log4jsProviders, fileProvider],
	exports: [ConfigModule, LoggerProviderFactory, ...log4jsProviders, fileProvider],
})
export class CoreModule {}
