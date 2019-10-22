import { Module } from '@nestjs/common';
import { SchemaUserModule } from '@schema/user/user.module';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import './core/subscribers';
import { SchemaAuthModule } from '@schema/auth/auth.module';
import { SchemaAddressModule } from '@schema/address/address.module';
import { SchemaLeagueModule } from '@schema/league/league.module';
import { SqlConnectionModule } from '@schema/core/connection/sql-connection.module';
import { SCHEMA_CONFIG } from '@core/config/config.constants';
import { SchemaTeamModule } from '@schema/team/team.module';
import { SchemaPlayerModule } from '@schema/player/player.module';

@Module({
	imports: [
		SchemaUserModule,
		SchemaAuthModule,
		SchemaAddressModule,
		SchemaLeagueModule,
		SchemaTeamModule,
		SchemaPlayerModule,
		CoreSchemaModule,
		SqlConnectionModule.forRootAsync({
			inject: [SCHEMA_CONFIG],
			useFactory: schemaConfig => ({
				type: 'postgres',
				host: schemaConfig.get('postgres:host'),
				port: schemaConfig.get('postgres:port'),
				username: schemaConfig.get('postgres:username'),
				password: schemaConfig.get('postgres:password'),
				database: schemaConfig.get('postgres:database'),
			}),
			imports: [CoreSchemaModule],
		}),
	],
	exports: [SqlConnectionModule],
})
export class SchemaModule {}
