import { Module } from '@nestjs/common';
import { CoreDataModule } from './../core/core-data.module';
import { ApiFootballService } from './api-football/api-football.service';
import { TeamApiService } from './api-football/api-team.service';

@Module({
	imports: [CoreDataModule],
	providers: [ApiFootballService, TeamApiService],
})
export class DataApiModule {}
