import { Module } from '@nestjs/common';
import { SchemaModule } from '@schema/schema.module';
import { CoreApiModule } from '@api/core/core-api.module';
import { FixtureService } from '@api/fixtures/services/fixture.service';
import { FixtureController } from '@api/fixtures/controllers/fixture.controller';

@Module({
	imports: [SchemaModule, CoreApiModule],
	controllers: [FixtureController],
	providers: [FixtureService],
	exports: [FixtureService],
})
export class FixtureModule {}
