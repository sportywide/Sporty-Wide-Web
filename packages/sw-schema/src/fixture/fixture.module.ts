import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';
import { FixtureService } from '@schema/fixture/services/fixture.service';
import { Fixture } from './models/fixture.entity';

@Module({
	imports: [CoreSchemaModule, SwRepositoryModule.forFeature({ entities: [Fixture] })],
	providers: [FixtureService],
	exports: [SwRepositoryModule, FixtureService],
})
export class SchemaFixtureModule {}
