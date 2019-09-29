import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLeague } from '@schema/league/models/user-league.entity';
import { League } from '@schema/league/models/league.entity';

@Module({
	imports: [CoreSchemaModule, TypeOrmModule.forFeature([UserLeague, League])],
})
export class SchemaLeagueModule {}
