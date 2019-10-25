import { Module } from '@nestjs/common';
import { CoreDataModule } from '@data/core/core-data.module';
import { TeamPlayerFifaCrawlerService } from '@root/packages/sw-data/src/crawler/team-player-fifa-crawler.service';
import { FixtureCrawlerService } from '@data/crawler/fixture-crawler.service';
import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { TeamPlayerScoreboardCrawlerService } from './team-player-scoreboard-crawler.service';

@Module({
	imports: [CoreDataModule],
	exports: [
		TeamPlayerFifaCrawlerService,
		FixtureCrawlerService,
		WhoScoreCrawlerService,
		TeamPlayerScoreboardCrawlerService,
	],
	providers: [
		TeamPlayerFifaCrawlerService,
		FixtureCrawlerService,
		WhoScoreCrawlerService,
		TeamPlayerScoreboardCrawlerService,
	],
})
export class CrawlerModule {}
