import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { Team } from '@schema/team/models/team.entity';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';
import { TeamService } from '@schema/team/services/team.service';

@Module({
	imports: [CoreSchemaModule, SwRepositoryModule.forFeature({ entities: [Team] })],
	exports: [SwRepositoryModule, TeamService],
	providers: [TeamService],
})
export class SchemaTeamModule {}
