import { Module } from '@nestjs/common';
import { ConfigModule } from '@core/config/config.module';
import { SCHEMA_CONFIG } from '@core/config/config.constants';
import { TypeormLoggerService } from '@schema/core/logging/typeorm.logger';
import { CoreModule } from '@core/core.module';
import { config } from '@schema/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			config,
			exportAs: SCHEMA_CONFIG,
		}),
		CoreModule,
	],
	providers: [TypeormLoggerService],
	exports: [TypeormLoggerService, ConfigModule],
})
export class CoreSchemaModule {}
