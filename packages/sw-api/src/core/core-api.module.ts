import { Module } from '@nestjs/common';
import { exceptionFilterProvider } from '@api/core/error/exception.provider';
import { CoreModule } from '@core/core.module';
import { ConfigModule } from '@core/config/config.module';
import path from 'path';
import { API_CONFIG } from '@core/config/config.constants';

@Module({
	providers: [exceptionFilterProvider],
	imports: [
		CoreModule,
		ConfigModule.forRoot({
			exportAs: API_CONFIG,
			configFile: path.resolve(__dirname, 'sw-api', 'config'),
		}),
	],
})
export class CoreApiModule {}
