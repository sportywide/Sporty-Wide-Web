import { Module } from '@nestjs/common';
import { SchemaUserModule } from '@schema/user/user.module';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { SCHEMA_CONFIG } from '@core/config/config.constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from '@schema/core/naming-strategy';
import { getMetadataArgsStorage } from 'typeorm';

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
				entities: getMetadataArgsStorage().tables.map(table => table.target),
				namingStrategy: new SnakeNamingStrategy(),
			}),
			imports: [CoreSchemaModule],
		}),
	],
})
export class SchemaModule {}
