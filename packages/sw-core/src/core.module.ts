import { Module } from '@nestjs/common';
import { LoggerModule } from '@core/logging/logger.module';
import { CoreConfigModule } from '@core/config/config.module';

@Module({
	imports: [LoggerModule, CoreConfigModule],
})
export class CoreModule {}
