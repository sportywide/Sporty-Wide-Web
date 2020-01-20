import { forwardRef, Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { Player } from '@schema/player/models/player.entity';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPlayersSchema } from '@schema/player/models/user-players.schema';
import { PlayerService } from '@schema/player/services/player.service';
import { SchemaLeagueModule } from '@schema/league/league.module';
import { PlayerRatingSchema } from '@schema/player/models/player-rating.schema';
import { SchemaFixtureModule } from '@schema/fixture/fixture.module';
import { PlayerBetting } from '@schema/player/models/player-betting.entity';
import { PlayerBettingService } from '@schema/player/services/player-betting.service';
import { PlayerStat } from '@schema/player/models/player-stat.entity';

@Module({
	imports: [
		CoreSchemaModule,
		SchemaLeagueModule,
		forwardRef(() => SchemaFixtureModule),
		SwRepositoryModule.forFeature({ entities: [Player, PlayerBetting, PlayerStat] }),
		MongooseModule.forFeature([{ name: 'UserPlayers', schema: UserPlayersSchema }]),
		MongooseModule.forFeature([{ name: 'PlayerRating', schema: PlayerRatingSchema }]),
	],
	providers: [PlayerService, PlayerBettingService],
	exports: [SwRepositoryModule, PlayerService, MongooseModule, PlayerBettingService],
})
export class SchemaPlayerModule {}
