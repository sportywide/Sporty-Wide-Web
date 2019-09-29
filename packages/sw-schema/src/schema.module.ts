import { Module } from '@nestjs/common';
import { SchemaUserModule } from '@schema/user/user.module';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { CORE_CONFIG, SCHEMA_CONFIG } from '@core/config/config.constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from '@schema/core/naming-strategy';
import { getMetadataArgsStorage } from 'typeorm';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';
import './subscribers';
import { TypeormLoggerService } from '@schema/core/logging/typeorm.logger';
import { CoreModule } from '@core/core.module';
import { isDevelopment } from '@shared/lib/utils/env';
import { SchemaAuthModule } from '@schema/auth/auth.module';
import { SchemaAddressModule } from '@schema/address/address.module';
import { SchemaLeagueModule } from '@schema/league/league.module';

const isDev = isDevelopment();

@Module({
	imports: [
		SchemaUserModule,
		SchemaAuthModule,
		SchemaAddressModule,
		SchemaLeagueModule,
		CoreSchemaModule,
		TypeOrmModule.forRootAsync({
			inject: [SCHEMA_CONFIG, CORE_CONFIG, TypeormLoggerService],
			useFactory: (schemaConfig, coreConfig, logger) => ({
				type: 'postgres',
				host: schemaConfig.get('postgres:host'),
				port: schemaConfig.get('postgres:port'),
				username: schemaConfig.get('postgres:username'),
				password: schemaConfig.get('postgres:password'),
				database: schemaConfig.get('postgres:database'),
				entities: getEntities(),
				subscribers: getSubscribers(),
				namingStrategy: new SnakeNamingStrategy(),
				logging: isDev ? ['query', 'error'] : ['error'],
				logger,
			}),
			imports: [CoreSchemaModule, CoreModule],
		}),
		SwRepositoryModule.forRoot({
			entities: getEntities(),
		}),
	],
	exports: [TypeOrmModule, SwRepositoryModule],
})
export class SchemaModule {}

function getEntities() {
	return getMetadataArgsStorage().tables.map(table => table.target as Function);
}

function getSubscribers() {
	return getMetadataArgsStorage().entitySubscribers.map(subscriber => subscriber.target as Function);
}
