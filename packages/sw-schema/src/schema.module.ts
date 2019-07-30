import { Module } from '@nestjs/common';
import { SchemaUserModule } from '@schema/user/user.module';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { SCHEMA_CONFIG } from '@core/config/config.constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from '@schema/core/naming-strategy';
import { getMetadataArgsStorage } from 'typeorm';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';
import './subscribers';

@Module({
	imports: [
		SchemaUserModule,
		CoreSchemaModule,
		TypeOrmModule.forRootAsync({
			inject: [SCHEMA_CONFIG],
			useFactory: schemaConfig => ({
				type: 'mysql',
				host: schemaConfig.get('mysql:host'),
				port: schemaConfig.get('mysql:port'),
				username: schemaConfig.get('mysql:username'),
				password: schemaConfig.get('mysql:password'),
				database: schemaConfig.get('mysql:database'),
				entities: getEntities(),
				subscribers: getSubscribers(),
				namingStrategy: new SnakeNamingStrategy(),
			}),
			imports: [CoreSchemaModule],
		}),
		SwRepositoryModule.forRoot({
			entities: getEntities(),
		}),
	],
})
export class SchemaModule {}

function getEntities() {
	return getMetadataArgsStorage().tables.map(table => table.target as Function);
}

function getSubscribers() {
	return getMetadataArgsStorage().entitySubscribers.map(subscriber => subscriber.target as Function);
}
