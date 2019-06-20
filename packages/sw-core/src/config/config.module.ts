import { Module } from '@nestjs/common';
import { configProvider } from '@core/config/config.provider';

@Module({
	exports: [configProvider],
	providers: [configProvider],
})
export class CoreConfigModule {}
