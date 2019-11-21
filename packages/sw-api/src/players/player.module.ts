import { Module } from '@nestjs/common';
import { SchemaModule } from '@schema/schema.module';
import { CoreApiModule } from '@api/core/core-api.module';
import { PlayerController } from '@api/players/controllers/player.controller';

@Module({
	imports: [SchemaModule, CoreApiModule],
	controllers: [PlayerController],
	providers: [],
	exports: [],
})
export class PlayerModule {}
