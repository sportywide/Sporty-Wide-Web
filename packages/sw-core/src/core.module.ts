import { Module } from '@nestjs/common';
import { LoggerModule } from '@core/logging/logger.module';
import { ConfigModule } from '@core/config/config.module';
import path from 'path';
import { CORE_CONFIG } from '@core/config/config.constants';

@Module({
	imports: [
		LoggerModule,
		ConfigModule.forRoot({
			configFile: path.resolve(__dirname, 'sw-core', 'config'),
			exportAs: CORE_CONFIG,
		}),
	],
})
export class CoreModule {}
