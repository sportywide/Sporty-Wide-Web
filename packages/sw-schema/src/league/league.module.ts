import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { UserLeague } from '@schema/league/models/user-league.entity';
import { League } from '@schema/league/models/league.entity';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserLeaguePreferenceSchema } from '@schema/league/models/user-league-preference.schema';
import { UserLeaguePreferenceService } from '@schema/league/services/user-league-preference.service';
import { LeagueTableSchema } from '@schema/league/models/league-table.schema';
import { LeagueResultService } from '@schema/league/services/league-result.service';

@Module({
	imports: [
		CoreSchemaModule,
		SwRepositoryModule.forFeature({ entities: [UserLeague, League] }),
		MongooseModule.forFeature([
			{ name: 'UserLeaguePreference', schema: UserLeaguePreferenceSchema },
			{ name: 'LeagueTable', schema: LeagueTableSchema },
		]),
	],
	providers: [UserLeaguePreferenceService, LeagueResultService],
	exports: [SwRepositoryModule, UserLeaguePreferenceService, LeagueResultService],
})
export class SchemaLeagueModule {}
