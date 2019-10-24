import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { UserLeague } from '@schema/league/models/user-league.entity';
import { League } from '@schema/league/models/league.entity';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';

@Module({
	imports: [CoreSchemaModule, SwRepositoryModule.forFeature({ entities: [UserLeague, League] })],
	exports: [SwRepositoryModule],
})
export class SchemaLeagueModule {}
