import { Module } from '@nestjs/common';
import { ConfigModule } from '@core/config/config.module';
import { config } from '@scheduling/config';
import { SCHEDULING_CONFIG } from '@core/config/config.constants';

@Module({
	imports: [
		ConfigModule.forRoot({
			config,
			exportAs: SCHEDULING_CONFIG,
		}),
	],
	exports: [ConfigModule],
})
export class CoreSchedulingModule {}
