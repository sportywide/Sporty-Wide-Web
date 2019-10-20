import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '@schema/player/models/player.entity';

@Module({
	imports: [CoreSchemaModule, TypeOrmModule.forFeature([Player])],
})
export class SchemaPlayerModule {}
