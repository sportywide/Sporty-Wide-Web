import { Module } from '@nestjs/common';
import { CoreDataModule } from '@data/core/core-data.module';
import { FifaCrawlerService } from '@root/packages/sw-data/src/crawler/fifa-crawler.service';
import { FixtureCrawlerService } from '@data/crawler/fixture-crawler.service';
import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { ScoreboardCrawlerService } from '@root/packages/sw-data/src/crawler/scoreboard-crawler.service';

@Module({
	imports: [CoreDataModule],
	exports: [FifaCrawlerService, FixtureCrawlerService, WhoScoreCrawlerService, ScoreboardCrawlerService],
	providers: [FifaCrawlerService, FixtureCrawlerService, WhoScoreCrawlerService, ScoreboardCrawlerService],
})
export class CrawlerModule {}
