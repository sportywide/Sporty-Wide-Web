import { Module } from '@nestjs/common';
import { SchemaModule } from '@schema/schema.module';
import { CoreApiModule } from '@api/core/core-api.module';
import { LeagueController } from '@api/leagues/controllers/league.controller';
import { LeagueService } from '@api/leagues/services/league.service';

@Module({
	imports: [SchemaModule, CoreApiModule],
	controllers: [LeagueController],
	providers: [LeagueService],
	exports: [LeagueService],
})
export class LeagueModule {}
