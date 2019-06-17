import { Module } from '@nestjs/common';
import { configProvider } from '@api/core/config/config.provider';
import { exceptionFilterProvider } from '@api/core/error/exception.provider';

@Module({
	exports: [configProvider],
	providers: [configProvider, exceptionFilterProvider],
})
export class CoreModule {}
