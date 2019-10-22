import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from '@schema/team/models/team.entity';

@Module({
	imports: [CoreSchemaModule, TypeOrmModule.forFeature([Team])],
})
export class SchemaFixtureModule {}
