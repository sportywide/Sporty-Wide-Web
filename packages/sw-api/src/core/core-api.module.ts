import { Module } from '@nestjs/common';
import { configProvider } from '@api/core/config/config.provider';
import { exceptionFilterProvider } from '@api/core/error/exception.provider';
import { CoreModule } from '@core/core.module';

@Module({
	exports: [configProvider],
	providers: [configProvider, exceptionFilterProvider],
	imports: [CoreModule],
})
export class CoreApiModule {}
