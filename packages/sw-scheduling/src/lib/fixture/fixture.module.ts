import { Module } from '@nestjs/common';
import { FixtureProcessService } from '@scheduling/lib/fixture/services/fixture-process.service';

@Module({
	providers: [FixtureProcessService],
	exports: [FixtureProcessService],
})
export class FixtureModule {}
