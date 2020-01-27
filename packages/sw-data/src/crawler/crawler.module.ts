import { Module } from '@nestjs/common';
import { CoreDataModule } from '@data/core/core-data.module';
import { FifaCrawlerService } from '@data/crawler/fifa-crawler.service';
import { FixtureCrawlerService } from '@data/crawler/fixture-crawler.service';
import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';
import { ScoreboardCrawlerService } from '@data/crawler/scoreboard-crawler.service';
import { BrowserService } from '@data/crawler/browser.service';
import { EspnCrawlerService } from '@data/crawler/espn-crawler.service';

@Module({
	imports: [CoreDataModule],
	exports: [
		FifaCrawlerService,
		FixtureCrawlerService,
		WhoScoreCrawlerService,
		ScoreboardCrawlerService,
		BrowserService,
		EspnCrawlerService,
	],
	providers: [
		FifaCrawlerService,
		FixtureCrawlerService,
		WhoScoreCrawlerService,
		ScoreboardCrawlerService,
		BrowserService,
		EspnCrawlerService,
	],
})
export class CrawlerModule {}
