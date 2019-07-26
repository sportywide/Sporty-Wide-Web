import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@core/config/config.module';
import { SCHEMA_CONFIG } from '@core/config/config.constants';

@Module({
	imports: [
		ConfigModule.forRoot({
			configFile: path.resolve(__dirname, 'sw-schema', 'config'),
			exportAs: SCHEMA_CONFIG,
		}),
	],
})
export class CoreSchemaModule {}
