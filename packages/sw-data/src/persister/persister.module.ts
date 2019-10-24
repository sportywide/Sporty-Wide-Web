import { SchemaPlayerModule } from '@schema/player/player.module';
import { Module } from '@nestjs/common';
import { PlayerPersisterService } from '@data/persister/player/player-persister.service';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { SqlConnectionModule } from '@schema/core/connection/sql-connection.module';
import { DATA_CONFIG, SCHEMA_CONFIG } from '@core/config/config.constants';
import { CoreDataModule } from '@data/core/core-data.module';
import { TeamPersisterService } from '@data/persister/team/team-persister.service';
import { FixturePersisterService } from '@data/persister/fixture/fixture-persister.service';
import { SchemaTeamModule } from './../../../sw-schema/src/team/team.module';
import { SchemaFixtureModule } from './../../../sw-schema/src/fixture/fixture.module';

@Module({
	imports: [
		CoreDataModule,
		SchemaPlayerModule,
		SchemaTeamModule,
		SchemaFixtureModule,
		SqlConnectionModule.forRootAsync({
			inject: [SCHEMA_CONFIG, DATA_CONFIG],
			useFactory: (schemaConfig, dataConfig) => ({
				type: 'postgres',
				host: dataConfig.get('postgres:url'),
				port: dataConfig.get('postgres:port'),
				username: dataConfig.get('postgres:username'),
				password: dataConfig.get('postgres:password'),
				database: dataConfig.get('postgres:database'),
			}),
			imports: [CoreSchemaModule, CoreDataModule],
		}),
	],
	providers: [PlayerPersisterService, TeamPersisterService, FixturePersisterService],
	exports: [PlayerPersisterService, TeamPersisterService, FixturePersisterService],
})
export class PersisterModule {}
