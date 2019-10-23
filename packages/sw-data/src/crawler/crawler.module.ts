import { Module } from '@nestjs/common';
import { CoreDataModule } from '@data/core/core-data.module';
import { TeamPlayerCrawlerService } from '@data/crawler/team-player-crawler.service';
import { FixtureCrawlerService } from '@data/crawler/fixture-crawler.service';
import { WhoScoreCrawlerService } from '@data/crawler/who-score-crawler.service';

@Module({
	imports: [CoreDataModule],
	exports: [TeamPlayerCrawlerService, FixtureCrawlerService, WhoScoreCrawlerService],
	providers: [TeamPlayerCrawlerService, FixtureCrawlerService, WhoScoreCrawlerService],
})
export class CrawlerModule {}
