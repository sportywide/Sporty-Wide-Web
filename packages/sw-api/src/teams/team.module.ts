import { Module } from '@nestjs/common';
import { SchemaModule } from '@schema/schema.module';
import { CoreApiModule } from '@api/core/core-api.module';
import { TeamsResolver } from '@api/teams/resolvers/team.resolver';

@Module({
	imports: [SchemaModule, CoreApiModule],
	providers: [TeamsResolver],
})
export class TeamModule {}
