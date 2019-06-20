import { Module } from '@nestjs/common';
import { databaseProviders } from '@schema/core/database.provider';
import { configProvider } from '@schema/core/config/config.provider';

@Module({
	providers: [...databaseProviders, configProvider],
	exports: [...databaseProviders, configProvider],
})
export class CoreSchemaModule {}
