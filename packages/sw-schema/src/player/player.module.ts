import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { Player } from '@schema/player/models/player.entity';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPlayersSchema } from '@schema/player/models/user-players.schema';
import { PlayerService } from '@schema/player/services/player.service';
import { SchemaUserModule } from '@schema/user/user.module';

@Module({
	imports: [
		CoreSchemaModule,
		SchemaUserModule,
		SwRepositoryModule.forFeature({ entities: [Player] }),
		MongooseModule.forFeature([{ name: 'UserPlayers', schema: UserPlayersSchema }]),
	],
	providers: [PlayerService],
	exports: [SwRepositoryModule, PlayerService],
})
export class SchemaPlayerModule {}
