import { SchemaPlayerModule } from '@schema/player/player.module';
import { Module } from '@nestjs/common';
import { PlayerPersisterService } from '@data/persister/player/player-persister.service';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { SqlConnectionModule } from '@schema/core/connection/sql-connection.module';
import { DATA_CONFIG, SCHEMA_CONFIG } from '@core/config/config.constants';
import { CoreDataModule } from '@data/core/core-data.module';
import { TeamPersisterService } from '@data/persister/team/team-persister.service';
import { FixturePersisterService } from '@data/persister/fixture/fixture-persister.service';
import { SchemaTeamModule } from '@schema/team/team.module';
import { SchemaFixtureModule } from '@schema/fixture/fixture.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemaLeagueModule } from '@schema/league/league.module';
import { isProduction } from '@shared/lib/utils/env';

@Module({
	imports: [
		CoreDataModule,
		SchemaPlayerModule,
		SchemaTeamModule,
		SchemaLeagueModule,
		SchemaFixtureModule,
		SqlConnectionModule.forRootAsync({
			inject: [SCHEMA_CONFIG, DATA_CONFIG],
			useFactory: (schemaConfig, dataConfig) => ({
				type: 'postgres',
				host: dataConfig.get('postgres:host'),
				port: dataConfig.get('postgres:port'),
				username: dataConfig.get('postgres:username'),
				password: dataConfig.get('postgres:password'),
				database: dataConfig.get('postgres:database'),
				extra: { max: 1 },
			}),
			keepConnectionAlive: false,
			imports: [CoreSchemaModule, CoreDataModule],
		}),
		MongooseModule.forRootAsync({
			inject: [SCHEMA_CONFIG],
			useFactory: schemaConfig => ({
				uri: `${isProduction() ? 'mongodb+srv' : 'mongodb'}://${schemaConfig.get(
					'mongo:username'
				)}:${schemaConfig.get('mongo:password')}@${schemaConfig.get('mongo:host')}/${schemaConfig.get(
					'mongo:database'
				)}?authSource=admin`,
				useNewUrlParser: true,
			}),
			imports: [CoreSchemaModule],
		}),
	],
	providers: [PlayerPersisterService, TeamPersisterService, FixturePersisterService],
	exports: [PlayerPersisterService, TeamPersisterService, FixturePersisterService],
})
export class PersisterModule {}
