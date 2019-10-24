import { Module } from '@nestjs/common';
import { ConfigModule } from '@core/config/config.module';
import { CORE_CONFIG } from '@core/config/config.constants';
import { config } from '@core/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			config,
			exportAs: CORE_CONFIG,
		}),
	],
	exports: [ConfigModule],
})
export class CoreConfigModule {}
