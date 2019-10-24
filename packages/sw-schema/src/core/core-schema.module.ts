import { Module } from '@nestjs/common';
import { ConfigModule } from '@core/config/config.module';
import { SCHEMA_CONFIG } from '@core/config/config.constants';
import { TypeormLoggerService } from '@schema/core/logging/typeorm.logger';
import { config } from '@schema/config';
import { LoggingModule } from '@core/logging/logging.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			config,
			exportAs: SCHEMA_CONFIG,
		}),
		LoggingModule,
	],
	providers: [TypeormLoggerService],
	exports: [TypeormLoggerService, ConfigModule],
})
export class CoreSchemaModule {}
