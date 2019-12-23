import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { Player } from '@schema/player/models/player.entity';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPlayersSchema } from '@schema/player/models/user-players.schema';
import { PlayerService } from '@schema/player/services/player.service';
import { SchemaLeagueModule } from '@schema/league/league.module';
import { PlayerStatSchema } from '@schema/player/models/player-stat.schema';
import { PlayerRatingSchema } from '@schema/player/models/player-rating.schema';

@Module({
	imports: [
		CoreSchemaModule,
		SchemaLeagueModule,
		SwRepositoryModule.forFeature({ entities: [Player] }),
		MongooseModule.forFeature([{ name: 'UserPlayers', schema: UserPlayersSchema }]),
		MongooseModule.forFeature([{ name: 'PlayerStat', schema: PlayerStatSchema }]),
		MongooseModule.forFeature([{ name: 'PlayerRating', schema: PlayerRatingSchema }]),
	],
	providers: [PlayerService],
	exports: [SwRepositoryModule, PlayerService, MongooseModule],
})
export class SchemaPlayerModule {}
