import path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@core/config/config.module';
import { CORE_CONFIG } from '@core/config/config.constants';
import { LoggerProviderFactory } from '@core/logging/logger-provider.factory';
import { log4jsProviders } from '@core/logging/logger.providers';

@Module({
	imports: [
		ConfigModule.forRoot({
			configFile: path.resolve(__dirname, 'sw-core', 'config'),
			exportAs: CORE_CONFIG,
		}),
	],
	providers: [LoggerProviderFactory, ...log4jsProviders],
	exports: [ConfigModule, LoggerProviderFactory, ...log4jsProviders],
})
export class CoreModule {}
