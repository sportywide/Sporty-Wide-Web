import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';
import { Fixture } from './models/fixture.entity';

@Module({
	imports: [CoreSchemaModule, SwRepositoryModule.forFeature({ entities: [Fixture] })],
	exports: [SwRepositoryModule],
})
export class SchemaFixtureModule {}
