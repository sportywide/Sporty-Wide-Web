import { Module } from '@nestjs/common';
import { CoreSchemaModule } from '@schema/core/core-schema.module';
import { Player } from '@schema/player/models/player.entity';
import { SwRepositoryModule } from '@schema/core/repository/sql/providers/repository.module';

@Module({
	imports: [CoreSchemaModule, SwRepositoryModule.forFeature({ entities: [Player] })],
	providers: [],
	exports: [SwRepositoryModule],
})
export class SchemaPlayerModule {}
