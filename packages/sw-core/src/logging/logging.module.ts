import { Module } from '@nestjs/common';
import { LoggerProviderFactory } from '@core/logging/logger-provider.factory';
import { log4jsProviders } from '@core/logging/logger.providers';
import { CoreConfigModule } from '@core/config/core-config.module';

@Module({
	imports: [CoreConfigModule],
	providers: [LoggerProviderFactory, ...log4jsProviders],
	exports: [LoggerProviderFactory, ...log4jsProviders],
})
export class LoggingModule {}
