import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { Team } from '@schema/team/models/team.entity';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';

@Module({
	imports: [CoreSchemaModule, SwRepositoryModule.forFeature({ entities: [Team] })],
	exports: [SwRepositoryModule],
})
export class SchemaFixtureModule {}
