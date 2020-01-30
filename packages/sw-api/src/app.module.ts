import { SchemaModule } from '@schema/schema.module';
import { AuthModule } from '@api/auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from '@api/app.controller';
import { AppService } from '@api/app.service';
import { SharedModule } from '@api/utils/shared.module';
import { UserModule } from '@api/user/user.module';
import { CoreApiModule } from '@api/core/core-api.module';
import { CoreModule } from '@core/core.module';
import { LeagueModule } from '@api/leagues/league.module';
import { PlayerModule } from '@api/players/player.module';
import { FixtureModule } from '@api/fixtures/fixture.module';
import { TeamModule } from '@api/teams/team.module';

@Module({
	imports: [
		AuthModule,
		SharedModule,
		SchemaModule,
		UserModule,
		LeagueModule,
		CoreApiModule,
		CoreModule,
		PlayerModule,
		FixtureModule,
		TeamModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
