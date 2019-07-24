import { Module } from '@nestjs/common';
import { databaseProviders } from '@schema/core/database.provider';
import { ConfigModule } from '@core/config/config.module';
import * as path from 'path';
import { SCHEMA_CONFIG } from '@core/config/config.constants';

@Module({
	imports: [
		ConfigModule.forRoot({
			configFile: path.resolve(__dirname, 'sw-schema', 'config'),
			exportAs: SCHEMA_CONFIG,
		}),
	],
	providers: [...databaseProviders],
	exports: [...databaseProviders],
})
export class CoreSchemaModule {}
