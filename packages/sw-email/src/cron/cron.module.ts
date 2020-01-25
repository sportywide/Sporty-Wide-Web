import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { CoreEmailModule } from '@email/core/core-email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScoreService } from '@email/cron/score/score.service';
import { SchemaModule } from '@schema/schema.module';

@Module({
	imports: [CoreModule, CoreEmailModule, SchemaModule, ScheduleModule.forRoot()],
	providers: [ScoreService],
})
export class CronModule {}
