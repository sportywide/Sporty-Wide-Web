import { Module, forwardRef } from '@nestjs/common';
import { LoggerProviderFactory } from '@core/logging/logger-provider.factory';
import { log4jsProviders } from '@core/logging/logger.providers';
import { CoreModule } from '@core/core.module';

@Module({
	imports: [forwardRef(() => CoreModule)],
	providers: [LoggerProviderFactory, ...log4jsProviders],
	exports: [LoggerProviderFactory, ...log4jsProviders],
})
export class LoggerModule {}
