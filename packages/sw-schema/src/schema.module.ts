import { Module } from '@nestjs/common';
import { SchemaUserModule } from '@schema/user/user.module';
import { SchemaAuthModule } from '@schema/auth/auth.module';
import { SchemaAddressModule } from '@schema/address/address.module';
import { SchemaLeagueModule } from '@schema/league/league.module';
import { SqlConnectionModule } from '@schema/core/connection/sql-connection.module';
import { SCHEMA_CONFIG } from '@core/config/config.constants';
import { SchemaTeamModule } from '@schema/team/team.module';
import { SchemaPlayerModule } from '@schema/player/player.module';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import './core/subscribers';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemaFixtureModule } from '@schema/fixture/fixture.module';
import { isProduction } from '@shared/lib/utils/env';

@Module({
	imports: [
		SchemaAuthModule,
		SchemaUserModule,
		SchemaAddressModule,
		SchemaLeagueModule,
		SchemaTeamModule,
		SchemaPlayerModule,
		SchemaFixtureModule,
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
		MongooseModule.forRootAsync({
			inject: [SCHEMA_CONFIG],
			useFactory: schemaConfig => ({
				uri: `${isProduction() ? 'mongodb+srv' : 'mongodb'}://${schemaConfig.get(
					'mongo:username'
				)}:${schemaConfig.get('mongo:password')}@${schemaConfig.get('mongo:host')}/${schemaConfig.get(
					'mongo:database'
				)}?authSource=admin`,
				useFindAndModify: false,
				useNewUrlParser: true,
			}),
			imports: [CoreSchemaModule],
		}),
	],
	exports: [
		SqlConnectionModule,
		CoreSchemaModule,
		SchemaAuthModule,
		SchemaUserModule,
		SchemaAddressModule,
		SchemaLeagueModule,
		SchemaTeamModule,
		SchemaPlayerModule,
		SchemaFixtureModule,
	],
})
export class SchemaModule {}
