import { Module } from '@nestjs/common';
import { SchemaModule } from '@schema/schema.module';
import { CoreApiModule } from '@api/core/core-api.module';
import { PlayerController } from '@api/players/controllers/player.controller';
import { LeagueModule } from '@api/leagues/league.module';
import { SchemaUserModule } from '@schema/user/user.module';

@Module({
	imports: [SchemaModule, CoreApiModule, SchemaUserModule, LeagueModule],
	controllers: [PlayerController],
	providers: [],
	exports: [],
})
export class PlayerModule {}
