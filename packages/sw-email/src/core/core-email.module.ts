import * as path from 'path';
import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { ConfigModule } from '@core/config/config.module';
import { EMAIL_CONFIG } from '@core/config/config.constants';

@Module({
	imports: [
		CoreModule,
		ConfigModule.forRoot({
			configFile: path.resolve(__dirname, 'sw-email', 'config'),
			exportAs: EMAIL_CONFIG,
		}),
	],
})
export class CoreEmailModule {}
